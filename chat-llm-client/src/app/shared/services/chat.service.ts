import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Chat } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiUrl = '/api/chats';

  constructor(private http: HttpClient) {}

  createChat(name?: string): Observable<Chat> {
    return this.http.post<Chat>(this.apiUrl, { name });
  }

  getAllChats(): Observable<Chat[]> {
    return this.http.get<Chat[]>(this.apiUrl);
  }
}
