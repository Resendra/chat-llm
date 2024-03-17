import { Injectable, NotImplementedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Model } from '../shared';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class LLMService {
  private randomTextAPI = 'https://random-word-api.vercel.app/api?words=10';

  constructor(private readonly httpService: HttpService) {}

  ask(prompt: string, model: Model): Promise<string> {
    switch (model) {
      case Model.RANDOM_LLM:
        return lastValueFrom(
          this.httpService.get<string>(this.randomTextAPI).pipe(
            map((response) => {
              return response.data;
            }),
          ),
        );
      case Model.GPT4_TURBO:
      default:
        throw new NotImplementedException();
    }
  }
}
