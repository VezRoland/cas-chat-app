import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { ChatService } from '../chat.service';
import { ListUser } from '../chat.model';
import { MatListModule } from '@angular/material/list';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'users',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './users.component.html',
})
export class UsersComponent {
  private chatService = inject(ChatService);
  readonly dialog = inject(MatDialog);

  openDialog() {
    this.chatService.getUsers().subscribe({
      next: (users) => {
        const dialogRef = this.dialog.open(UsersDialog, {
          data: users,
        });
      },
    });
  }
}

@Component({
  selector: 'users-dialog',
  imports: [MatDialogModule, MatListModule, DatePipe, MatButtonModule],
  templateUrl: './users-dialog.component.html',
})
export class UsersDialog {
  private router = inject(Router);
  private authService = inject(AuthService);
  private chatService = inject(ChatService);

  readonly dialogRef = inject(MatDialogRef<UsersDialog>);
  readonly data = inject<ListUser[]>(MAT_DIALOG_DATA);

  onSendMessageClick(userId: string, username: string) {
    this.chatService
      .createConversation({
        title: `${this.authService.currentUser()?.username}, ${username}`,
        participants: [userId],
      })
      .subscribe({
        next: (conversation) => {
          this.dialogRef.close();
          this.router.navigate([`/chat/${conversation.id}`]);
        },
      });
  }

  onCloseClick() {
    this.dialogRef.close();
  }
}
