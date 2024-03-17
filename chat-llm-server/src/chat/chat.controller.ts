import { Controller, Get, Post, Body } from '@nestjs/common';
import { Chat } from '../shared';
import { ChatService } from './chat.service';
import { CreateChatDto } from './create-chat.dto';

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  async getAllChats(): Promise<Chat[]> {
    return this.chatService.getAllChats();
  }

  @Post()
  async createChat(@Body() createChatDto: CreateChatDto): Promise<Chat> {
    return this.chatService.createChat(createChatDto);
  }
}
