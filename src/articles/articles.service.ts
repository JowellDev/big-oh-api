import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { Article } from './article.entity';
import { CreateArticleDto } from './dtos/create-article.dto';
import { Comment } from './comment.entity';
import { Liker } from './liker.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article) private articlesRepo: Repository<Article>,
    @InjectRepository(Comment) private commentsRepo: Repository<Comment>,
    @InjectRepository(Liker) private likersRepo: Repository<Liker>,
  ) {}

  async findAllUnpublished(): Promise<Article[]> {
    return await this.articlesRepo
      .createQueryBuilder('Article')
      .select('*')
      .where('is_published IS false')
      .orderBy('published_at', 'DESC')
      .getRawMany();
  }

  async findAll(): Promise<Article[]> {
    return await this.articlesRepo.find({ is_published: true });
  }

  async findOne(id: number): Promise<Article> {
    const articles = await this.articlesRepo.findOne(id);
    if (!articles) throw new NotFoundException('Article not found');

    const comments = await this.commentsRepo.find({ article_id: id });
    const likers = await this.likersRepo.find({ article_id: id });
    articles.comments = comments;
    articles.likers = likers;

    return articles;
  }

  async create(article: CreateArticleDto, user: User): Promise<Article> {
    const newArticle = this.articlesRepo.create(article);
    const date = new Date();
    const fullDate = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
    newArticle.created_at = fullDate;
    return await this.articlesRepo.save(newArticle);
  }

  async update(id: number, article: CreateArticleDto) {
    let articleFound = await this.findOne(id);
    if (!articleFound) throw new NotFoundException('Article not found');

    articleFound = { ...articleFound, ...article };
    return await this.articlesRepo.save(articleFound);
  }

  async remove(id: number) {
    const article = await this.articlesRepo.findOne(id);
    if (!article) throw new NotFoundException('Article not found');

    await this.articlesRepo.remove(article);
    return {
      message: 'Article deleted with success !',
    };
  }

  async fullTextSearch(keyword: string) {
    return await this.articlesRepo
      .createQueryBuilder('Article')
      .where('body ILIKE :value', { value: `%${keyword}%` })
      .orWhere('title ILIKE :value', { value: `%${keyword}%` })
      .andWhere('is_published IS true')
      .orderBy('published_at', 'DESC')
      .getRawMany();
  }

  async filterByCategory(category: string) {
    return await this.articlesRepo
      .createQueryBuilder('Article')
      .select('*')
      .where('category = :category', { category })
      .andWhere('is_published IS true')
      .orderBy('published_at', 'DESC')
      .getRawMany();
  }

  async publishArticle(id: number) {
    const article = await this.findOne(id);
    if (!article) throw new NotFoundException('Article not found');

    const date = new Date();
    const fullDate = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;

    article.is_published = !article.is_published;
    article.published_at = fullDate;

    return await this.articlesRepo.save(article);
  }

  async rePublishArticle(id: number) {
    const article = await this.findOne(id);
    if (!article) throw new NotFoundException('Article not found');

    const date = new Date();
    const fullDate = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
    article.published_at = fullDate;

    return await this.articlesRepo.save(article);
  }

  async likeArticle(articleId: number, user: User) {
    const article = await this.findOne(articleId);
    if (!article) throw new NotFoundException('Article not found');

    const liker = await this.likersRepo.findOne({
      user_email: user.email,
      article_id: articleId,
    });

    if (liker) {
      article.likes--;
      await this.likersRepo.remove(liker);
      await this.articlesRepo.save(article);
      return {
        message: 'Article unliked with success !',
      };
    }

    article.likes++;
    await this.articlesRepo.save(article);
    await this.addLike(articleId, user);

    return {
      message: 'Article liked with success !',
    };
  }

  private async addLike(articleId: number, user: User) {
    const date = new Date();
    const fullDate = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
    const newLiker = this.likersRepo.create({
      user_email: user.email,
      article_id: articleId,
    });
    newLiker.created_at = fullDate;
    return await this.likersRepo.save(newLiker);
  }

  async commentArticle(articleId: number, user: User, comment: string) {
    const article = await this.findOne(articleId);
    if (!article) throw new NotFoundException('Article not found');

    await this.addComment(articleId, user, comment);

    return {
      message: 'comment save with success !',
    };
  }

  private async addComment(articleId: number, user: User, comment: string) {
    const date = new Date();
    const fullDate = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
    const newComment = this.commentsRepo.create({
      body: comment,
      user_email: user.email,
      article_id: articleId,
    });

    newComment.created_at = fullDate;

    await this.commentsRepo.save(newComment);
  }
}
