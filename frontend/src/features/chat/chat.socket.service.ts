import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { ConversationMessage } from './chat.model';

@Injectable({ providedIn: 'root' })
export class ChatSocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000', {
      withCredentials: true,
    });
  }

  sendMessage(message: { userId: string; conversationId: string; content: string }): void {
    this.socket.emit('message:create', message);
  }

  onMessageSent(
    callback: (message: ConversationMessage & { conversationId: string }) => void,
  ): void {
    this.socket.on('message:create', callback);
  }
}
