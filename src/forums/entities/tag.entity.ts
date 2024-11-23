import { Entity, Column, ManyToMany } from 'typeorm';

import { Forum } from './forum.entity';

export const forumTags = [
  'Ação policial',
  'Arrastão',
  'Ataque a civis',
  'Briga',
  'Homicídio/Tentativa'
];

@Entity()
export class Tag {
  @Column({ unique: true, primary: true })
  name: string;

  @ManyToMany(() => Forum, (forum) => forum.tags)
  forums: Forum[];
}
