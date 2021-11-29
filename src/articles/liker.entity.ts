import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity()
export class Liker {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int' })
  article_id: number;

  @Column()
  user_email: string;

  @Column()
  created_at: string;
}
