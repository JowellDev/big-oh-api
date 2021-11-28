import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  body: string;

  @PrimaryColumn({ type: 'int' })
  article_id: number;

  @PrimaryColumn({ type: 'int' })
  user_id: number;

  @Column()
  createdAt: string;

  // @ManyToOne(() => Article, (article) => article.comments)
  // article: Article;
}
