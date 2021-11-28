import { User } from 'src/users/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  PrimaryColumn,
  OneToOne,
  JoinTable,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Likers {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn({ type: 'int' })
  article_id: number;

  @PrimaryColumn({ type: 'int' })
  user_id: number;

  @Column()
  createdAt: string;

  // @ManyToOne(() => Article, (article) => article.comments)
  // article: Article;
}
