import { Component, computed, effect, inject, input, linkedSignal, OnInit, signal } from '@angular/core';
import { ChatService } from '../chat.service';
import { AuthService } from '../../auth/auth.service';
import { NgClass, DatePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { form, FormField } from '@angular/forms/signals';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ChatSocketService } from '../chat.socket.service';

@Component({
  selector: 'chat-area',
  templateUrl: './chat-area.component.html',
  imports: [
    MatToolbarModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    DatePipe,
    MatIcon,
    MatButtonModule,
    FormField,
    MatListModule,
  ],
})
export class ChatAreaComponent implements OnInit {
  private router = inject(Router);
  private titleService = inject(Title);
  private chatService = inject(ChatService);

  id = input<string>();

  user = this.chatService.conversationUser;
  conversation = this.chatService.conversation;
  messages = this.chatService.conversationMessages;

  messageModel = signal({
    message: '',
  });
  messageForm = form(this.messageModel);

  constructor(private chatSocketService: ChatSocketService) {
    effect(() => {
      if (this.id()) {
        const currentId = this.id()!;
        this.chatService.getConversation(currentId);
        this.chatService.getConversationMessages(currentId);
        this.chatService.getConversationUser(currentId);
        this.titleService.setTitle(`${this.conversation()?.title} | Chat App`);
      }
    });
  }

  ngOnInit(): void {
    this.chatSocketService.onMessageSent((message) => {
      if (this.conversation()?.id !== message.conversationId) return;
      this.messages.update((msg) => [...msg, message]);
    });
  }

  sendMessage() {
    const text = this.messageForm.message().value().trim();
    const id = this.id();

    if (id && text.length > 0) {
      this.chatSocketService.sendMessage({
        userId: this.user()?.id || '',
        conversationId: this.conversation()?.id || '',
        content: text,
      });
      this.messageForm.message().reset('');
    }
  }

  leaveConversation() {
    const currentId = this.id();
    if (!currentId) return;
    this.chatService.leaveConversation(currentId).subscribe({
      next: () => {
        this.chatService.getConversationPreviews();
        this.router.navigate(['/chat']);
      },
    });
  }

  deleteConversation() {
    const currentId = this.id();
    if (!currentId) return;
    this.chatService.deleteConversation(currentId).subscribe({
      next: () => {
        this.chatService.getConversationPreviews();
        this.router.navigate(['/chat']);
      },
    });
  }
}
