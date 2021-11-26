import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dtos/create-article.dto';
import { UpdateArticleDto } from './dtos/update-article.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  async getArticles() {
    return await this.articlesService.findAll();
  }

  @Get(':id')
  async getArticle(@Param('id') id: string) {
    return await this.articlesService.findOne(+id);
  }

  @Post()
  async createArticle(
    @CurrentUser() user: User,
    @Body() body: CreateArticleDto,
  ) {
    return await this.articlesService.create(body, user);
  }

  @Put(':id')
  async updateArticle(@Param('id') id: string, @Body() body: UpdateArticleDto) {
    return await this.articlesService.update(+id, body);
  }

  @Delete(':id')
  async deleteArticle(@Param('id') id: string) {
    return await this.articlesService.remove(+id);
  }
}
