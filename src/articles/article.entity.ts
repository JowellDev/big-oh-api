import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Comment } from './comment.entity';
import { Liker } from './liker.entity';

@Entity()
export class Article {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ type: 'varchar', length: 255 })
  category: string;

  @Column({ type: 'int', default: 0 })
  likes: number;

  @Column({ type: 'bool', default: false })
  is_published: boolean;

  @Column({ type: 'varchar' })
  created_at: string;

  @Column({ type: 'varchar', nullable: true })
  published_at: string;

  comments: Comment[];

  likers: Liker[];
}
