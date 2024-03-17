import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Model, Owner, Feedback, MessageStatus } from '../enums';
import { Chat } from './chat.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @Column({
    type: 'enum',
    enum: Owner,
    default: Owner.USER,
  })
  owner: Owner;

  @Column({
    type: 'enum',
    enum: Model,
    nullable: true,
  })
  model?: Model;

  @Column({
    type: 'enum',
    enum: MessageStatus,
    nullable: true,
  })
  status?: MessageStatus;

  @Column({
    type: 'enum',
    enum: Feedback,
    nullable: true,
  })
  feedback?: Feedback;

  @ManyToOne(() => Chat, (chat) => chat.messages)
  chat: Chat;

  @CreateDateColumn()
  timestamp: Date;
}
