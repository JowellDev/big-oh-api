import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  body: string;

  @Column()
  article_id: number;

  @Column()
  user_email: string;

  @Column()
  created_at: string;
}
