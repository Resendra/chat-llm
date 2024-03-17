import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { EventsModule } from '../events';
import { LLMModule } from '../llm';
import { Message } from '../shared';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { MessageContentProcessor } from './message-content.processor';

@Module({
  controllers: [MessageController],
  providers: [MessageService, MessageContentProcessor],
  imports: [
    TypeOrmModule.forFeature([Message]),
    BullModule.registerQueue({
      name: 'message-content',
    }),
    EventsModule,
    LLMModule,
  ],
})
export class MessageModule {}
