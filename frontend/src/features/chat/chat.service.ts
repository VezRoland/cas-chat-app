import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import {
  Conversation,
  ConversationMessage,
  ConversationPreview,
  ConversationUser,
  ListConversation,
  ListUser,
  NewConversationBody,
  NewConversationResponse,
} from './chat.model';
import { Socket } from 'ngx-socket-io';
import { toObservable } from '@angular/core/rxjs-interop';
import { map, of, switchMap } from 'rxjs';

const API_URL = 'http://localhost:3000';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private socket = inject(Socket);
  private http = inject(HttpClient);

  activeChatId = signal<string | null>(null);

  private _messages = signal<ConversationMessage[]>([]);
  messages = this._messages.asReadonly();

  private _previews = signal<ConversationPreview[]>([]);
  previews = this._previews.asReadonly();

  conversation = signal<Conversation | null>(null);
  conversationPreviews = signal<ConversationPreview[]>([]);
  conversationMessages = signal<ConversationMessage[]>([]);
  conversationUser = signal<ConversationUser | null>(null);

  constructor() {
    toObservable(this.activeChatId)
      .pipe(
        switchMap((id) => {
          this._messages.set([]);
          if (!id) return of([]);
          this.selectConversation(id);
          return this.getConversationMessages(id);
        }),
      )
      .subscribe((history) => this._messages.set(history));

    this.socket.fromEvent<ConversationMessage>('message:new').subscribe((newMessage) => {
      this._messages.update((messages) => [...messages, newMessage]);
    });
  }

  getUsers() {
    return this.http.get<ListUser[]>(`${API_URL}/users`, { withCredentials: true });
  }

  selectConversation(id: string) {
    this.socket.emit('conversation:select', id);
  }

  createConversation(newConversation: NewConversationBody) {
    return this.http.post<NewConversationResponse>(`${API_URL}/conversations`, newConversation, {
      withCredentials: true,
    });
  }

  getConversation(id: string) {
    return this.http
      .get<Conversation>(`${API_URL}/conversations/${id}`, { withCredentials: true })
      .subscribe((conversation) => this.conversation.set(conversation));
  }

  joinConversation(id: string) {
    return this.http.post(`${API_URL}/conversations/${id}/join`, null, {
      withCredentials: true,
    });
  }

  leaveConversation(id: string) {
    return this.http.post(`${API_URL}/conversations/${id}/leave`, null, {
      withCredentials: true,
    });
  }

  deleteConversation(id: string) {
    return this.http.delete(`${API_URL}/conversations/${id}`, { withCredentials: true });
  }

  getConversations() {
    return this.http.get<ListConversation>(`${API_URL}/conversations/discover`, {
      withCredentials: true,
    });
  }

  getConversationPreviews() {
    return this.http
      .get<ConversationPreview[]>(`${API_URL}/conversations/`, { withCredentials: true })
      .subscribe((previews) => this.conversationPreviews.set(previews));
  }

  getConversationMessages(id: string) {
    return this.http.get<ConversationMessage[]>(`${API_URL}/conversations/${id}/messages`, {
      withCredentials: true,
    });
  }

  getConversationMessage() {
    return this.socket.fromEvent('message:new').pipe(map((message) => message));
  }

  sendConversationMessage(content: string) {
    this.socket.emit('message:send', { id: this.activeChatId(), content });
  }

  getConversationUser(id: string) {
    return this.http
      .get<ConversationUser>(`${API_URL}/conversations/${id}/users/me`, {
        withCredentials: true,
      })
      .subscribe({
        next: (user) => user,
      });
  }
}
