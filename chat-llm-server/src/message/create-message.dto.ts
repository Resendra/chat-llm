import { Model } from '../shared';

export class CreateMessageDTO {
  chatId: string;
  content: string;
  model: Model;
}
