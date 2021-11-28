import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { Article } from './article.entity';
import { CreateArticleDto } from './dtos/create-article.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article) private articlesRepo: Repository<Article>,
  ) {}

  async findAllUnpublished(): Promise<Article[]> {
    return await this.articlesRepo
      .createQueryBuilder()
      .select('*')
      .where('isPublished IS false')
      .orderBy('publishedAt', 'DESC')
      .getRawMany();
  }

  async findAll(): Promise<Article[]> {
    return await this.articlesRepo
      .createQueryBuilder()
      .select('*')
      .where('isPublished IS true')
      .orderBy('publishedAt', 'DESC')
      .getRawMany();
  }

  async findOne(id: number): Promise<Article> {
    const articles = await this.articlesRepo.findOne(id);
    if (!articles) throw new NotFoundException('Article not found');

    return articles;
  }

  async create(article: CreateArticleDto, user: User): Promise<Article> {
    const newArticle = this.articlesRepo.create(article);
    const date = new Date();
    const fullDate = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
    newArticle.createAt = fullDate;
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
      .createQueryBuilder()
      .select('*')
      .where('isPublished IS true')
      .andWhere(':keyword IN body', { keyword })
      .orderBy('publishedAt', 'DESC')
      .getRawMany();
  }

  async filterByCategory(category: string) {
    return await this.articlesRepo
      .createQueryBuilder()
      .select('*')
      .where('isPublished IS true')
      .andWhere('category = :category', { category })
      .orderBy('publishedAt', 'DESC')
      .getRawMany();
  }

  async publishArticle(id: number) {
    const article = await this.findOne(id);
    if (!article) throw new NotFoundException('Article not found');

    const date = new Date();
    const fullDate = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;

    article.isPublished = !article.isPublished;
    article.publishedAt = fullDate;

    return await this.articlesRepo.save(article);
  }

  async rePublishArticle(id: number) {
    const article = await this.findOne(id);
    if (!article) throw new NotFoundException('Article not found');

    const date = new Date();
    const fullDate = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
    article.publishedAt = fullDate;

    return await this.articlesRepo.save(article);
  }
}
