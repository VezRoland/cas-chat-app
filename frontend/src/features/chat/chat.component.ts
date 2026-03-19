import { Component, inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { ChatListComponent } from './chat-list/chat-list.component';
import { Router, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UsersComponent } from './users/users.component';
import { ConversationsComponent } from './conversations/conversations.component';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  imports: [
    ChatListComponent,
    RouterOutlet,
    MatButtonModule,
    MatIconModule,
    UsersComponent,
    ConversationsComponent,
    MatDividerModule,
  ],
  templateUrl: './chat.component.html',
})
export class ChatComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  user = this.authService.currentUser;

  handleSignOut() {
    this.authService.signout().subscribe({
      next: () => this.router.navigate(['/signin']),
    });
  }
}
