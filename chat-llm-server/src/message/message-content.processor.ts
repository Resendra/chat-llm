import {
  Processor,
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
} from '@nestjs/bull';
import { Job } from 'bull';
import { EventsGateway } from '../events';
import { LLMService } from '../llm';
import { Message, MessageStatus } from '../shared';
import { MessageService } from './message.service';

@Processor('message-content')
export class MessageContentProcessor {
  constructor(
    private readonly llmService: LLMService,
    private readonly messageService: MessageService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  @OnQueueActive()
  onActive(job: Job) {
    console.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}`,
    );
  }

  @OnQueueCompleted()
  async onCompleted(job: Job) {
    const { message } = job.data;

    const updatedMessage = await this.messageService.updateMessageStatus(
      message.id,
      MessageStatus.COMPLETED,
    );

    this.eventsGateway.emit('update-message', updatedMessage);

    console.log(`Job ${job.id} completed successfully`);
  }

  @OnQueueFailed()
  async onFailed(job: Job, error: any) {
    const { message } = job.data;

    const updatedMessage = await this.messageService.updateMessageStatus(
      message.id,
      MessageStatus.ERROR,
    );

    this.eventsGateway.emit('update-message', updatedMessage);

    console.log(`Job ${job.id} failed with error: ${error.message}`);
  }

  @Process()
  async transcode(
    job: Job<{ prompt: string; message: Message }>,
  ): Promise<void> {
    const { prompt, message } = job.data;
    const content = await this.llmService.ask(prompt, message.model);
    console.log(`Response generated`);
    const updatedMessage = await this.messageService.updateMessageContent(
      message.id,
      content,
    );
    this.eventsGateway.emit('update-message', updatedMessage);
  }
}
