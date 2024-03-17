import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from '../shared/entities/chat.entity';
import { CreateChatDto } from './create-chat.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
  ) {}

  async getAllChats(): Promise<Chat[]> {
    return this.chatRepository.find();
  }

  async createChat(createChatDto: CreateChatDto): Promise<Chat> {
    const chatToCreate = {
      name: createChatDto.name || `New chat - ${new Date().toISOString()}`,
    };

    const newChat = this.chatRepository.create(chatToCreate);
    await this.chatRepository.save(newChat);
    return newChat;
  }
}
