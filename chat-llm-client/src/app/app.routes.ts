import { Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { ChatListComponent } from './chat-list/chat-list.component';

export const routes: Routes = [
  {
    path: 'chats',
    component: ChatListComponent,
    children: [{ path: ':id', component: ChatComponent }],
  },
  { path: '', redirectTo: '/chats', pathMatch: 'full' },
];
