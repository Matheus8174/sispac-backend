import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import { Tag } from './tag.entity';
import { Comment } from './comment.entity';
import { User } from '@/users/entities/user.entity';

@Entity('forums')
export class Forum {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  subject: string;

  @Column({ type: 'text' })
  content: string;

  @Column()
  cityId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.forums, { onDelete: 'CASCADE' })
  owner: User;

  @OneToMany(() => Comment, (comment) => comment.forum)
  comments: Comment[];

  @ManyToMany(() => User, (user) => user.favoriteForums)
  favoritedBy: User[];

  @ManyToMany(() => Tag, (tag) => tag.forums)
  @JoinTable()
  tags: Tag[];
}
