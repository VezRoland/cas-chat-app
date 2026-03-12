import { Component } from '@angular/core';
import { Navbar } from '../../../components/navbar/navbar';

interface ChatRoom {
  id: string;
  title: string;
  owner: string;
}

@Component({
  imports: [Navbar],
  templateUrl: './rooms-page.html',
})
export class RoomsPage {
  // Just some dummy data
  rooms: ChatRoom[] = [
    {
      id: 'a',
      title: 'Hello World!',
      owner: 'John Doe',
    },
    {
      id: 'b',
      title: 'World Hello',
      owner: 'Doe John',
    },
  ];
}
