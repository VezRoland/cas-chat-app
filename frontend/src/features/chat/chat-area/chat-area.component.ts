import { Component, effect, inject, input, signal } from '@angular/core';
import { ChatService } from '../chat.service';
import { AuthService } from '../../auth/auth.service';
import { DatePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { form, FormField } from '@angular/forms/signals';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

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
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private titleService = inject(Title);
  private chatService = inject(ChatService);

  id = input<string>();

  user = this.chatService.conversationUser;
  conversation = this.chatService.conversation;
  messages = this.chatService.messages;

  messageModel = signal({
    message: '',
  });
  messageForm = form(this.messageModel);

  constructor() {
    this.route.params.subscribe((params) => {
      this.chatService.activeChatId.set(params['id']);
    });

    effect(() => {
      if (this.id()) {
        const currentId = this.id()!;
        this.chatService.getConversation(currentId);
        this.chatService.getConversationUser(currentId);
        this.titleService.setTitle(`${this.conversation()?.title} | Chat App`);
      }
    });
  }

  sendMessage() {
    const text = this.messageForm.message().value().trim();
    const id = this.id();

    if (id && text.length > 0) {
      this.chatService.sendConversationMessage(text);
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
