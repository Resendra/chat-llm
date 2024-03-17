import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { Message } from '../shared';
import { MessageService } from './message.service';
import { CreateMessageDTO } from './create-message.dto';
import { UpdateFeedbackDTO } from './update-feedback.dto';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('/:chatId')
  async getPaginatedMessages(
    @Param('chatId') chatId: string,
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
  ): Promise<Message[]> {
    const pageNumber = parseInt(page, 10) || 1;
    const pageSizeNumber = parseInt(pageSize, 10) || 50;

    return this.messageService.getPaginatedMessages(
      chatId,
      pageNumber,
      pageSizeNumber,
    );
  }

  @Get('/:chatId/from/:lastMessageId')
  getMessagesFromId(
    @Param('chatId') chatId: string,
    @Param('lastMessageId') lastMessageId: string,
    @Query('direction') direction: 'older' | 'newer',
    @Query('limit') limit: string,
  ): Promise<Message[]> {
    return this.messageService.getMessagesFromId(
      chatId,
      lastMessageId,
      direction,
      parseInt(limit, 10) || 50,
    );
  }

  @Post()
  createMessage(
    @Body() createMessageDTO: CreateMessageDTO,
  ): Promise<Message[]> {
    return this.messageService.createMessage(createMessageDTO);
  }

  @Put('/:messageId/feedback')
  updateFeedback(
    @Param('messageId') messageId: string,
    @Body() updateFeedbackDTO: UpdateFeedbackDTO,
  ) {
    return this.messageService.updateMessageFeedback(
      messageId,
      updateFeedbackDTO.feedback,
    );
  }
}
