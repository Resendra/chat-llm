import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { join } from 'path';
import { ChatModule } from './chat';
import { env } from './environment';
import { MessageModule } from './message';
import { EventsModule } from './events';
import { LLMModule } from './llm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: env.db.host,
      port: env.db.port,
      username: env.db.username,
      password: env.db.password,
      database: env.db.database,
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      synchronize: true,
      // migrations: [],
      // migrationsRun: true,
    }),
    BullModule.forRoot({
      redis: {
        host: env.redis.host,
        port: env.redis.port,
      },
    }),
    ChatModule,
    MessageModule,
    EventsModule,
    LLMModule,
  ],
})
export class AppModule {}
