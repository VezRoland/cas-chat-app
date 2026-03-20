import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { ConversationMessage } from './chat.model';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatSocketService {
  constructor(private socket: Socket) {}

  sendMessage(message: { userId: string; conversationId: string; content: string }): void {
    this.socket.emit('message:create', message);
  }

  getMessage() {
    return this.socket
      .fromEvent('message:create')
      .pipe(map((message: ConversationMessage) => message));
  }
}
