import { Forum } from '../../forums/entities/forum.entity';
import { Comment } from '../../forums/entities/comment.entity';
import { Complaint } from '../../complaints/entities/complaint.entity';

import * as bcrypt from 'bcrypt';

import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  avatar: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @BeforeInsert()
  async hashPassword() {
    const salt = 8;

    this.password = await bcrypt.hash(this.password, salt);
  }

  @OneToMany(() => Complaint, (complaint) => complaint.user)
  complaints: Complaint[];

  @OneToMany(() => Forum, (forum) => forum.owner)
  forums: Forum[];

  @OneToMany(() => Comment, (comment) => comment.owner)
  comments: Comment[];

  @ManyToMany(() => Forum, (forum) => forum.favoritedBy)
  @JoinTable()
  favoriteForums: Forum[];
}
