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

  @Column({ default: 0 })
  likes: number;

  @Column()
  createAt: string;
}
