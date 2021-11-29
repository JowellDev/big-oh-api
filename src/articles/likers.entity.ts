import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity()
export class Likers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  article_id: number;

  @Column()
  userEmail: string;

  @Column()
  createdAt: string;
}
