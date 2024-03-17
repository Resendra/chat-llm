import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { Message } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private socket = io({ path: '/sock' });

  getMessageUpdate(): Observable<Message> {
    return new Observable((observer) => {
      this.socket.on('update-message', (data: any) => {
        observer.next(data);
      });
    });
  }
}
