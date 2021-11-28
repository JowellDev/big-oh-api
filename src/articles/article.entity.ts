import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  body: string;

  @Column()
  category: string;

  @Column({ default: 0 })
  likes: number;

  @Column({ default: false })
  isPublished: boolean;

  @Column()
  createAt: string;

  @Column()
  publishedAt: string;

  // @OneToMany(() => Comment, (comment) => comment.article)
  // comments: Comment[];

  // @OneToMany(() => Likers, (likers) => likers.article)
  // likers: Comment[];
}
