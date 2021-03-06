import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Brackets, Repository } from 'typeorm';
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
      .orderBy('id', 'DESC')
      .getRawMany();
  }

  async findAll(): Promise<Article[]> {
    return await this.articlesRepo
      .createQueryBuilder('Article')
      .select('*')
      .where('is_published IS true')
      .orderBy('id', 'DESC')
      .getRawMany();
  }

  async findOne(id: number): Promise<Article> {
    const article = await this.articlesRepo.findOne(id);
    if (!article) throw new NotFoundException('Article not found');

    const comments = await this.commentsRepo.find({ article_id: id });
    const likers = await this.likersRepo.find({ article_id: id });
    article.comments = comments;
    article.likers = likers;

    return article;
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

  async remove(articleId: number) {
    const article = await this.articlesRepo.findOne(articleId);
    if (!article) throw new NotFoundException('Article not found');

    await this.removeArticleComment(articleId);
    await this.removeArticleLikers(articleId);

    await this.articlesRepo.remove(article);

    return {
      message: 'Article deleted with success !',
    };
  }

  async removeArticleComment(articleId: number) {
    const comments = await this.commentsRepo.find({ article_id: articleId });
    if (comments) {
      comments.map(async (comment) => {
        await this.commentsRepo.remove(comment);
      });
    }
  }

  async removeArticleLikers(articleId: number) {
    const likers = await this.likersRepo.find({ article_id: articleId });
    if (likers) {
      likers.map(async (liker) => {
        await this.likersRepo.remove(liker);
      });
    }
  }

  async fullTextSearch(keyword: string) {
    if (keyword === '') return this.findAll();
    return await this.articlesRepo
      .createQueryBuilder('Article')
      .select('*')
      .where('is_published IS true')
      .andWhere(
        new Brackets((qb) => {
          qb.where('body ILIKE :value', {
            value: `%${keyword}%`,
          }).orWhere('title ILIKE :value', { value: `%${keyword}%` });
        }),
      )
      .orderBy('id', 'DESC')
      .getRawMany();
  }

  async filterByCategory(category: string) {
    if (category === '') return this.findAll();
    return await this.articlesRepo
      .createQueryBuilder('Article')
      .select('*')
      .where('category = :category', { category })
      .andWhere('is_published IS true')
      .orderBy('id', 'DESC')
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
      const comments = await this.commentsRepo.find({ article_id: articleId });
      const likers = await this.likersRepo.find({ article_id: articleId });
      article.comments = comments;
      article.likers = likers;

      return article;
    }

    article.likes++;
    await this.articlesRepo.save(article);
    await this.addLike(articleId, user);
    const comments = await this.commentsRepo.find({ article_id: articleId });
    const likers = await this.likersRepo.find({ article_id: articleId });
    article.comments = comments;
    article.likers = likers;

    return article;
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
    const comments = await this.commentsRepo.find({ article_id: articleId });
    const likers = await this.likersRepo.find({ article_id: articleId });
    article.comments = comments;
    article.likers = likers;
    return article;
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

  async deleteComment(articleId: number, commentId: number) {
    const article = await this.findOne(articleId);
    if (!article) throw new NotFoundException('Article not found');

    const comment = await this.commentsRepo.findOne(commentId);
    if (!comment) throw new NotFoundException('Comment not found');

    await this.commentsRepo.remove(comment);
    return {
      message: 'Comment deleted with success !',
    };
  }
}
