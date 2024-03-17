import { SafeHtml } from '@angular/platform-browser';
import { Feedback, MessageStatus, Model, Owner } from '../enums';

export interface Message {
  id: string;
  content: string;
  owner: Owner;
  model?: Model;
  feedback?: Feedback;
  status?: MessageStatus;
  timestamp: string;
}

export interface SafeMessage extends Omit<Message, 'content'> {
  content: SafeHtml;
}
