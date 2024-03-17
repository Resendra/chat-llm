import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bull';
import { Repository } from 'typeorm';
import { Feedback, Message, MessageStatus, Owner } from '../shared';
import { CreateMessageDTO } from './create-message.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectQueue('message-content') private readonly messageContentQueue: Queue,
  ) {}

  async getMessageById(id: string) {
    return this.messageRepository.findOneBy({ id });
  }

  async getPaginatedMessages(
    chatId: string,
    page: number = 1,
    pageSize: number = 50,
  ): Promise<Message[]> {
    const [messages, total] = await this.messageRepository.findAndCount({
      where: { chat: { id: chatId } },
      order: {
        timestamp: 'DESC', // Sorting messages by date in descending order
      },
      take: pageSize,
      skip: (page - 1) * pageSize,
    });

    console.log(`Total messages in chat: ${total}`);
    return messages;
  }

  async getMessagesFromId(
    chatId: string,
    lastMessageId: string,
    direction: 'older' | 'newer' = 'older',
    limit: number = 50,
  ): Promise<Message[]> {
    const comparisonOperator = direction === 'older' ? '<' : '>';

    const queryBuilder = this.messageRepository
      .createQueryBuilder('message')
      .where('message.chatId = :chatId', { chatId }) // Ensure messages are filtered by chatId
      .andWhere(
        `message.timestamp ${comparisonOperator} (SELECT timestamp FROM message WHERE id = :lastMessageId)`,
        { lastMessageId },
      )
      .orderBy('message.timestamp', direction === 'older' ? 'DESC' : 'ASC')
      .take(limit);

    return queryBuilder.getMany();
  }

  async createMessage(createMessageDTO: CreateMessageDTO): Promise<Message[]> {
    const userMessageToCreate = {
      content: createMessageDTO.content,
      chat: { id: createMessageDTO.chatId },
      owner: Owner.USER,
    };

    const newUserMessage =
      await this.messageRepository.save(userMessageToCreate);

    const userMessage = await this.getMessageById(newUserMessage.id);

    const systemMessageToCreate = {
      content: '',
      status: MessageStatus.ON_GOING,
      chat: { id: createMessageDTO.chatId },
      owner: Owner.SYSTEM,
      model: createMessageDTO.model,
    };

    const newSystemMessage = await this.messageRepository.save(
      systemMessageToCreate,
    );

    const systemMessage = await this.getMessageById(newSystemMessage.id);

    this.messageContentQueue.add(
      { prompt: createMessageDTO.content, message: systemMessage },
      {
        removeOnComplete: true,
        removeOnFail: true,
      },
    );

    return [userMessage, systemMessage];
  }

  async updateMessageContent(id: string, content: string): Promise<Message> {
    await this.messageRepository.save({ id, content });
    return this.getMessageById(id);
  }

  async updateMessageStatus(
    id: string,
    status: MessageStatus,
  ): Promise<Message> {
    await this.messageRepository.save({ id, status });
    return this.getMessageById(id);
  }

  async updateMessageFeedback(
    id: string,
    feedback: Feedback,
  ): Promise<Message> {
    await this.messageRepository.save({ id, feedback });
    return this.getMessageById(id);
  }
}
