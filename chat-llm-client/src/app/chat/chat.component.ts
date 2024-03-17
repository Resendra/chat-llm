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
import {
  Owner,
  Model,
  SafeMessage,
  EventService,
  Feedback,
  Message,
} from '../shared';
import { MessageService } from './message.service';

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
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit {
  Owner = Owner;

  modelsMap = {
    [Model.RANDOM_LLM]: 'RandomLLM',
    [Model.GPT4_TURBO]: 'ChatGPT 4',
  };

  models = [
    { id: Model.RANDOM_LLM, value: this.modelsMap[Model.RANDOM_LLM] },
    { id: Model.GPT4_TURBO, value: this.modelsMap[Model.GPT4_TURBO] },
  ];

  selectedModel = this.models[0].id;

  newMessage: string = '';

  messages: SafeMessage[] = [];

  chatId: string | null = null;

  currentPage = 1;
  pageSize = 50;

  isLoading = false;
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

  loadMessages(loadPrevious = false) {
    if (loadPrevious) {
      this.currentPage++;
    } else {
      // Reset to first page when chatId changes or component initializes
      this.currentPage = 1;
      this.messages = [];
    }

    if (this.chatId) {
      this.messageService
        .getPaginatedMessages(this.chatId, this.currentPage, this.pageSize)
        .subscribe((data) => {
          // Prepend old messages if loading previous, else replace
          const safeMessages = data.map((item) => {
            const newItem: SafeMessage = {
              ...item,
              content: this.sanitizer.bypassSecurityTrustHtml(item.content),
            };
            return newItem;
          });

          this.messages = loadPrevious
            ? [...safeMessages, ...this.messages]
            : safeMessages;

          this.messages.sort(
            (a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp)
          );

          setTimeout(() => this.scrollToBottom());
        });
    }
  }

  loadPreviousMessages() {
    const oldestMessageId = this.messages[0]?.id;
    if (this.chatId && oldestMessageId) {
      this.messageService
        .getMessagesFromId(this.chatId, oldestMessageId, 'older')
        .subscribe((newMessages) => {
          const safeMessages = newMessages.map((item) => {
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
        });
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
        !!message.feedback ? null : Feedback.THUMB_UP
      )
      .subscribe((message) => {
        this.findAndReplaceMessage(message);
      });
  }

  thumbDown(message: SafeMessage) {
    this.messageService
      .updateMessageFeedback(
        message.id,
        !!message.feedback ? null : Feedback.THUMB_DOWN
      )
      .subscribe((message) => {
        this.findAndReplaceMessage(message);
      });
  }
}
