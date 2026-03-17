import { Component, inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { ChatListComponent } from './chat-list/chat-list.component';
import { Router, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [ChatListComponent, RouterOutlet, MatButtonModule, MatIconModule],
  templateUrl: './chat.component.html',
})
export class ChatComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  user = this.authService.currentUser;

  handleSignOut() {
    this.authService.signout().subscribe({
      next: () => this.router.navigate(['/signin']),
    });
  }
}
