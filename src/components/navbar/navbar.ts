import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

interface NavbarLink {
  title: string;
  url: string;
}

@Component({
  selector: 'navbar',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './navbar.html',
})
export class Navbar {
  links: NavbarLink[] = [
    { title: 'Home', url: '/' },
    { title: 'Chat Rooms', url: '/rooms' },
  ];
}
