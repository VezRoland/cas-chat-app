import { Component, inject, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { RouterLink } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'chat-list',
  templateUrl: './chat-list.components.html',
  imports: [
    RouterLink,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
  ],
})
export class ChatListComponent implements OnInit {
  private chatService = inject(ChatService);

  previews = this.chatService.conversationPreviews;

  ngOnInit() {
    this.chatService.getConversationPreviews();
  }
}
