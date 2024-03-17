import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { LLMService } from './llm.service';

@Module({
  providers: [LLMService],
  imports: [HttpModule],
  exports: [LLMService],
})
export class LLMModule {}
