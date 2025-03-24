import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { Roles } from 'src/auth/decorator/role.decorator';
import { UserRole } from 'src/users/enum/role.enum';
import { Public } from 'src/auth/decorator/public.decorator';
import RequestWithUser from 'src/auth/requestWithUser.interface';
import { User } from 'src/users/entities/user.entity';

@ApiTags('Article')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(RoleGuard)
  @Roles(UserRole.Admin, UserRole.Editor, UserRole.Author)
  @ApiOperation({ summary: 'Create article' })
  @ApiResponse({ status: 201, description: 'The article has been successfully created.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@Body() createArticleDto: CreateArticleDto, @Req() req: RequestWithUser) {
    createArticleDto.authorId = req.user.id;
    console.log(createArticleDto);
    return this.articlesService.create(createArticleDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all articles' })
  @ApiResponse({ status: 200, description: 'Return all articles.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findAll() {
    return this.articlesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get article by id' })
  @ApiResponse({ status: 200, description: 'Return the article.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findOne(@Param('id') id: string) {

    if (id === 'me') {
      return this.articlesService.findAllByAuthor(+id);
    }

    return this.articlesService.findOne(+id);
  }

  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update article' })
  @ApiResponse({ status: 200, description: 'The article has been successfully updated.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async update(@Req() req: RequestWithUser, @Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    const { user } = req;

    const article = await this.articlesService.findOne(+id);
    if (user.role === UserRole.Author) {
      if (article.author.id !== user.id) {
        throw new Error('Forbidden');
      }
    }

    return this.articlesService.update(+id, updateArticleDto);
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete article' })
  @ApiResponse({ status: 200, description: 'The article has been successfully deleted.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async remove(@Req() req: RequestWithUser, @Param('id') id: string) {

    const { user } = req;
    const article = await this.articlesService.findOne(+id);
    if (user.role === UserRole.Author) {
      console.log(article, user.id);
      if (article.author === null || article.author.id !== user.id) {
        throw new ForbiddenException('Forbidden');
      }
    }

    return this.articlesService.remove(+id);
  }
}
