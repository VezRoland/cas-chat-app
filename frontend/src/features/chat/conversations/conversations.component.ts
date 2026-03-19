import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { ChatService } from '../chat.service';
import { ListConversation } from '../chat.model';
import { MatListModule } from '@angular/material/list';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'conversations',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './conversations.component.html',
})
export class ConversationsComponent {
  private chatService = inject(ChatService);
  readonly dialog = inject(MatDialog);

  openDialog() {
    this.chatService.getConversations().subscribe({
      next: (conversations) => {
        const dialogRef = this.dialog.open(ConversationsDialog, {
          data: conversations,
        });
      },
    });
  }
}

@Component({
  selector: 'conversations-dialog',
  imports: [MatDialogModule, MatListModule, DatePipe, MatButtonModule],
  templateUrl: './conversations-dialog.component.html',
})
export class ConversationsDialog {
  private router = inject(Router);
  private chatService = inject(ChatService);

  readonly dialogRef = inject(MatDialogRef<ConversationsDialog>);
  readonly data = inject<ListConversation[]>(MAT_DIALOG_DATA);

  onSendJoinClick(id: string) {
    this.chatService.joinConversation(id).subscribe({
      next: () => {
        this.dialogRef.close();
        this.chatService.getConversationPreviews();
        this.router.navigate([`/chat/${id}`]);
      },
    });
  }

  onCloseClick() {
    this.dialogRef.close();
  }
}
