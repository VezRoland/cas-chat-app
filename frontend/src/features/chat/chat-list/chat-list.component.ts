import { Component, inject, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { RouterLink } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'chat-list',
  templateUrl: './chat-list.components.html',
  imports: [RouterLink, MatSidenavModule, MatButtonModule, MatIconModule],
})
export class ChatListComponent implements OnInit {
  private chatService = inject(ChatService);

  previews = this.chatService.conversationPreviews;

  ngOnInit() {
    this.chatService.getConversationPreviews();
  }
}
