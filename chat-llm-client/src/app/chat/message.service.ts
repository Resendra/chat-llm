import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Feedback,
  Message,
  Model,
  Paginated,
  PaginationParams,
} from '../shared';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private apiUrl = '/api/messages';

  constructor(private http: HttpClient) {}

  getMessagesByChatId(
    chatId: string,
    params: PaginationParams
  ): Observable<Paginated<Message>> {
    return this.http.get<Paginated<Message>>(`${this.apiUrl}/${chatId}`, {
      params: { ...params },
    });
  }

  getMessagesByChatIdFromId(
    chatId: string,
    lastMessageId: string,
    direction: 'older' | 'newer' = 'older',
    limit: number = 50
  ): Observable<Paginated<Message>> {
    return this.http.get<Paginated<Message>>(
      `${this.apiUrl}/${chatId}/from/${lastMessageId}`,
      {
        params: { direction, limit: limit.toString() },
      }
    );
  }

  //  When creating a message, we create the user message and immediately a system message which will be filled afterwards
  createMessage(
    chatId: string,
    content: string,
    model: Model
  ): Observable<Message[]> {
    return this.http.post<Message[]>(this.apiUrl, { content, model, chatId });
  }

  updateMessageFeedback(
    messageId: string,
    feedback: Feedback | null
  ): Observable<Message> {
    return this.http.put<Message>(`${this.apiUrl}/${messageId}/feedback`, {
      feedback,
    });
  }
}
