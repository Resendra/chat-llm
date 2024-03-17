import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Message, Paginated, PaginationParams } from '../shared';
import { MessageService } from './message.service';
import { CreateMessageDTO } from './create-message.dto';
import { UpdateFeedbackDTO } from './feedback.dto';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('/:chatId')
  async getMessages(
    @Param('chatId') chatId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<Paginated<Message>> {
    const paginationParams: PaginationParams = {
      page: page ? +page : 1,
      limit: limit ? +limit : 50,
    };

    let result: { data: Message[]; total: number };

    if (chatId) {
      result = await this.messageService.getMessagesByChatId(
        chatId,
        paginationParams,
      );
    } else {
      throw new NotFoundException(
        'Please provide a chat id to retrieve messages',
      );
    }

    return {
      data: result.data,
      total: result.total,
      page: paginationParams.page,
      limit: paginationParams.limit,
      totalPages: Math.ceil(result.total / paginationParams.limit),
    };
  }

  @Get('/:chatId/from/:lastMessageId')
  async getMessagesFromId(
    @Param('chatId') chatId: string,
    @Param('lastMessageId') lastMessageId: string,
    @Query('direction') direction: 'older' | 'newer',
    @Query('limit') limit: number,
  ): Promise<Paginated<Message>> {
    const paginationParams: PaginationParams = {
      page: 1,
      limit: limit ? +limit : 50,
    };

    let result: { data: Message[]; total: number };

    if (chatId) {
      result = await this.messageService.getMessagesFromId(
        chatId,
        lastMessageId,
        direction,
        limit || 50,
      );
    } else {
      throw new NotFoundException(
        'Please provide a chat id to retrieve messages',
      );
    }

    return {
      data: result.data,
      total: result.total,
      page: paginationParams.page,
      limit: paginationParams.limit,
      totalPages: Math.ceil(result.total / paginationParams.limit),
    };
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
