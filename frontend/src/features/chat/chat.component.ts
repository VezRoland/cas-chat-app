import { Component, inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { ChatListComponent } from './chat-list/chat-list.component';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [ChatListComponent, RouterOutlet],
  templateUrl: './chat.component.html',
})
export class ChatComponent {
  private authService = inject(AuthService);

  user = this.authService.currentUser;
}
