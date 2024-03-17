import { CommonModule } from '@angular/common';
import { OnInit, Component, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  Owner,
  Model,
  SafeMessage,
  EventService,
  Feedback,
  Message,
  MessageStatus,
} from '../shared';
import { MessageService } from './message.service';
import { finalize, tap } from 'rxjs';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit {
  Owner = Owner;
  MessageStatus = MessageStatus;

  modelsMap = {
    [Model.RANDOM_LLM]: 'RandomLLM',
    [Model.GPT4_TURBO]: 'ChatGPT 4',
  };

  models = [
    { id: Model.RANDOM_LLM, value: this.modelsMap[Model.RANDOM_LLM] },
    {
      id: Model.GPT4_TURBO,
      value: this.modelsMap[Model.GPT4_TURBO],
      disabled: true,
    },
  ];

  selectedModel = this.models[0].id;

  newMessage: string = '';

  messages: SafeMessage[] = [];

  chatId: string | null = null;

  limit = 50;

  canLoadMoreMessages = false;
  isLoading = false;
  isLoadingMore = false;
  hasError = false;

  @ViewChild('scrollContainer') private scrollContainer?: ElementRef;

  constructor(
    private messageService: MessageService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private eventService: EventService
  ) {}

  private findAndReplaceMessage(message: Message) {
    const index = this.messages.findIndex((item) => item.id === message.id);

    if (index >= 0) {
      this.messages[index] = message;
    }
  }

  private scrollToBottom(): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollTop =
        this.scrollContainer.nativeElement.scrollHeight;
    }
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.chatId = params.get('id');
      this.loadMessages();
    });

    this.eventService.getMessageUpdate().subscribe((updatedMessage) => {
      this.findAndReplaceMessage(updatedMessage);
    });
  }

  private loadMessages() {
    this.isLoading = true;
    // Reset when chatId changes or component initializes
    this.messages = [];

    if (this.chatId) {
      this.messageService
        .getMessagesByChatId(this.chatId, { page: 1, limit: this.limit })
        .pipe(
          tap({
            next: ({ data, total }) => {
              const safeMessages = data.map((item) => {
                const newItem: SafeMessage = {
                  ...item,
                  content: this.sanitizer.bypassSecurityTrustHtml(item.content),
                };
                return newItem;
              });

              this.messages = safeMessages;

              this.messages.sort(
                (a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp)
              );

              this.hasError = false;
              this.canLoadMoreMessages = total > this.messages.length;

              setTimeout(() => this.scrollToBottom());
            },
            error: () => {
              this.hasError = true;
            },
          }),
          finalize(() => {
            this.isLoading = false;
          })
        )
        .subscribe();
    }
  }

  loadPreviousMessages() {
    const oldestMessageId = this.messages[0]?.id;
    if (this.chatId && oldestMessageId) {
      this.isLoadingMore = true;

      this.messageService
        .getMessagesByChatIdFromId(this.chatId, oldestMessageId, 'older')
        .pipe(
          tap({
            next: ({ data, total }) => {
              const safeMessages = data.map((item) => {
                const newItem: SafeMessage = {
                  ...item,
                  content: this.sanitizer.bypassSecurityTrustHtml(item.content),
                };
                return newItem;
              });

              this.messages = [...safeMessages, ...this.messages];

              this.messages.sort(
                (a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp)
              );

              this.hasError = false;
              this.canLoadMoreMessages = total > this.messages.length;
            },
            error: () => {
              this.hasError = true;
            },
          }),
          finalize(() => {
            this.isLoadingMore = false;
          })
        )
        .subscribe();
    }
  }

  sendMessage() {
    if (!this.chatId || !this.newMessage.trim()) {
      return;
    }

    this.messageService
      .createMessage(this.chatId, this.newMessage, this.selectedModel)
      .subscribe((messages) => {
        this.messages.push(...messages);
        setTimeout(() => this.scrollToBottom());
        this.newMessage = '';
      });
  }

  thumbUp(message: SafeMessage) {
    this.messageService
      .updateMessageFeedback(
        message.id,
        message.feedback === Feedback.THUMB_UP ? null : Feedback.THUMB_UP
      )
      .subscribe((message) => {
        this.findAndReplaceMessage(message);
      });
  }

  thumbDown(message: SafeMessage) {
    this.messageService
      .updateMessageFeedback(
        message.id,
        message.feedback === Feedback.THUMB_DOWN ? null : Feedback.THUMB_DOWN
      )
      .subscribe((message) => {
        this.findAndReplaceMessage(message);
      });
  }
}
