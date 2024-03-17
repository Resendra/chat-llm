import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { Chat, ChatService } from '../shared';

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [RouterModule, MatSidenavModule, MatButtonModule, MatIconModule],
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.scss',
})
export class ChatListComponent {
  chats: Chat[] = [];

  constructor(private chatService: ChatService, private router: Router) {}

  createChat() {
    this.chatService.createChat().subscribe((chat) => {
      this.chats.unshift(chat);
      this.router.navigate(['/chats', chat.id]);
    });
  }

  ngOnInit() {
    this.loadChats();
  }

  loadChats() {
    this.chatService.getAllChats().subscribe((chats) => {
      this.chats = chats || [];
      this.chats.sort(
        (a, b) => Date.parse(b.creationDate) - Date.parse(a.creationDate)
      );
    });
  }
}
