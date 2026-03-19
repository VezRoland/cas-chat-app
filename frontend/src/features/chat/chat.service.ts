import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Conversation, ConversationMessage, ConversationPreview } from './chat.model';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly apiUrl = 'http://localhost:3000';

  conversation = signal<Conversation | null>(null);
  conversationPreviews = signal<ConversationPreview[]>([]);
  conversationMessages = signal<ConversationMessage[]>([]);

  constructor(private http: HttpClient) {}

  getConversation(id: string) {
    return this.http
      .get<Conversation>(`${this.apiUrl}/conversations/${id}`, { withCredentials: true })
      .subscribe((conversation) => this.conversation.set(conversation));
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
