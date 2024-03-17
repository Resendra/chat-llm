import { SafeHtml } from '@angular/platform-browser';
import { Feedback, Model, Owner } from '../enums';

export interface Message {
  id: string;
  content: string;
  owner: Owner;
  model?: Model;
  feedback?: Feedback;
  timestamp: string;
}

export interface SafeMessage extends Omit<Message, 'content'> {
  content: SafeHtml;
}
