import { Component, effect, inject, input } from '@angular/core';
import { ChatService } from '../chat.service';
import { AuthService } from '../../auth/auth.service';
import { NgClass, DatePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: 'chat-area',
  templateUrl: './chat-area.component.html',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    NgClass,
    DatePipe,
    MatIcon,
    MatButtonModule
],
})
export class ChatAreaComponent {
  private authService = inject(AuthService);
  private chatService = inject(ChatService);

  id = input<string>();
  user = this.authService.currentUser;
  messages = this.chatService.conversationMessages;

  constructor() {
    effect(() => {
      const currentId = this.id();
      if (currentId) {
        this.chatService.getConversationMessages(currentId);
      }
    });
  }
}
