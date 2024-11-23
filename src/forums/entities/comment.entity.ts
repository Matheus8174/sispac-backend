import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  UpdateDateColumn
} from 'typeorm';
import { Forum } from './forum.entity';
import { User } from '@/users/entities/user.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
  owner: User;

  @ManyToOne(() => Forum, (forum) => forum.comments, { onDelete: 'CASCADE' })
  forum: Forum;

  @UpdateDateColumn()
  updatedAt: Date;
}
