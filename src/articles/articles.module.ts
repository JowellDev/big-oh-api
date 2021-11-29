import { Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './article.entity';
import { Comment } from './comment.entity';
import { Liker } from './liker.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Article, Comment, Liker])],
  controllers: [ArticlesController],
  providers: [ArticlesService],
})
export class ArticlesModule {}
