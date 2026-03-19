import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import {
  Conversation,
  ConversationMessage,
  ConversationPreview,
  ListConversation,
  ListUser,
  NewConversationBody,
  NewConversationResponse,
} from './chat.model';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly apiUrl = 'http://localhost:3000';

  conversation = signal<Conversation | null>(null);
  conversationPreviews = signal<ConversationPreview[]>([]);
  conversationMessages = signal<ConversationMessage[]>([]);

  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get<ListUser[]>(`${this.apiUrl}/users`, { withCredentials: true });
  }

  createConversation(newConversation: NewConversationBody) {
    return this.http.post<NewConversationResponse>(
      `${this.apiUrl}/conversations`,
      newConversation,
      {
        withCredentials: true,
      },
    );
  }

  getConversation(id: string) {
    return this.http
      .get<Conversation>(`${this.apiUrl}/conversations/${id}`, { withCredentials: true })
      .subscribe((conversation) => this.conversation.set(conversation));
  }

  joinConversation(id: string) {
    return this.http.post(`${this.apiUrl}/conversations/${id}/join`, null, {
      withCredentials: true,
    });
  }

  leaveConversation(id: string) {
    return this.http.post(`${this.apiUrl}/conversations/${id}/leave`, null, {
      withCredentials: true,
    });
  }

  getConversations() {
    return this.http.get<ListConversation>(`${this.apiUrl}/conversations/discover`, {
      withCredentials: true,
    });
  }

  getConversationPreviews() {
    return this.http
      .get<ConversationPreview[]>(`${this.apiUrl}/conversations/`, { withCredentials: true })
      .subscribe((previews) => this.conversationPreviews.set(previews));
  }

  getConversationMessages(id: string) {
    return this.http
      .get<
        ConversationMessage[]
      >(`${this.apiUrl}/conversations/${id}/messages`, { withCredentials: true })
      .subscribe((messages) => this.conversationMessages.set(messages));
  }

  sendConversationMessage(id: string, content: string) {
    return this.http
      .post<ConversationMessage>(
        `${this.apiUrl}/conversations/${id}/message`,
        {
          content,
        },
        { withCredentials: true },
      )
      .subscribe({
        next: () => this.getConversationMessages(id),
      });
  }
}
