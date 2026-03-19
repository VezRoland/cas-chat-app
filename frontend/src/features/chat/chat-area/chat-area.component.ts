import { Component, effect, inject, input, signal } from '@angular/core';
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
export class ChatAreaComponent {
  private authService = inject(AuthService);
  private chatService = inject(ChatService);

  id = input<string>();
  user = this.authService.currentUser;
  conversation = this.chatService.conversation;
  messages = this.chatService.conversationMessages;

  messageModel = signal({
    message: '',
  });
  messageForm = form(this.messageModel);

  constructor() {
    effect(() => {
      const currentId = this.id();
      if (currentId) {
        this.chatService.getConversation(currentId);
        this.chatService.getConversationMessages(currentId);
      }
    });
  }

  sendMessage() {
    const text = this.messageForm.message().value().trim();
    const id = this.id();

    if (id && text.length > 0) {
      this.chatService.sendConversationMessage(id, text);
      this.messageForm.message().reset('');
    }
  }
}
