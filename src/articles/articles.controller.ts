import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { AdminGuard } from '../guards/admin.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dtos/create-article.dto';
import { UpdateArticleDto } from './dtos/update-article.dto';
import { CommentArticleDto } from './dtos/comment-article.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  async getArticles() {
    return await this.articlesService.findAll();
  }

  @Get('search')
  async fullTextSearch(@Query('keyword') keyword: string) {
    return await this.articlesService.fullTextSearch(keyword);
  }

  @Get('filter')
  async filterByCategory(@Query('category') category: string) {
    return await this.articlesService.filterByCategory(category);
  }

  @Get('unpublished')
  @UseGuards(AdminGuard)
  async getUnPublishedArticles() {
    return await this.articlesService.findAllUnpublished();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getArticle(@CurrentUser() user: User, @Param('id') id: string) {
    return await this.articlesService.findOne(+id);
  }

  @Post()
  @UseGuards(AdminGuard)
  async createArticle(
    @CurrentUser() user: User,
    @Body() body: CreateArticleDto,
  ) {
    return await this.articlesService.create(body, user);
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  async updateArticle(@Param('id') id: string, @Body() body: UpdateArticleDto) {
    return await this.articlesService.update(+id, body);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async deleteArticle(@Param('id') id: string) {
    return await this.articlesService.remove(+id);
  }

  @Put(':id/publish')
  @UseGuards(AdminGuard)
  async publishArticle(@Param('id') id: string) {
    return await this.articlesService.publishArticle(+id);
  }

  @Put(':id/republish')
  @UseGuards(AdminGuard)
  async rePublishArticle(@Param('id') id: string) {
    return await this.articlesService.rePublishArticle(+id);
  }

  @Post(':id/like')
  @UseGuards(AuthGuard)
  async likeArticle(@CurrentUser() user: User, @Param('id') articleId: string) {
    return await this.articlesService.likeArticle(+articleId, user);
  }

  @Post(':id/comment')
  @UseGuards(AuthGuard)
  async commentArticle(
    @CurrentUser() user: User,
    @Param('id') articleId: string,
    @Body() body: CommentArticleDto,
  ) {
    return await this.articlesService.commentArticle(
      +articleId,
      user,
      body.comment,
    );
  }

  @Delete(':id/comment/:commentId')
  @UseGuards(AuthGuard)
  async deleteComment(
    @Param('id') articleId: string,
    @Param('commentId') commentId: string,
  ) {
    return await this.articlesService.deleteComment(+articleId, +commentId);
  }
}
