import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  body: string;

  @Column()
  articleId: number;

  @Column()
  userEmail: string;

  @Column()
  createdAt: string;
}
