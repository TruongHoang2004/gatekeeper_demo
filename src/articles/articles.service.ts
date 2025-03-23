import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,
    private readonly usersService: UsersService
  ) {}

  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    if (!createArticleDto.authorId) {
      throw new NotFoundException('Author not found');
    }

    const author = await this.usersService.findOneById(createArticleDto.authorId);

    const article = this.articlesRepository.create(createArticleDto);
    return this.articlesRepository.save(article);
  }

  async findAll(): Promise<Article[]> {
    return this.articlesRepository.find({ where: { published: true } });
  }

  async findAllByAuthor(authorId: number): Promise<Article[]> {
    return this.articlesRepository.find({ where: { author: { id: authorId} } });
  }

  async findOne(id: number): Promise<Article> {
    const article = await this.articlesRepository.findOne({where: {id, published: true}});
    if (!article) {
      throw new NotFoundException(`Article with id ${id} not found`);
    }
    return article;
  }

  async update(id: number, updateArticleDto: UpdateArticleDto): Promise<Article> {
    await this.articlesRepository.update(id, updateArticleDto);
    const article = await this.articlesRepository.findOne({where: {id}});
    if (!article) {
      throw new NotFoundException(`Article with id ${id} not found`);
    }
    return article;
  }

  async remove(id: number): Promise<void> {
    await this.articlesRepository.delete(id);
  }
}
