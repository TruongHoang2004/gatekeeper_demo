import { IsString, IsBoolean, IsOptional, IsInt } from 'class-validator';

export class CreateArticleDto {
    @IsString()
    title: string;

    @IsString()
    content: string;

    @IsOptional()
    @IsBoolean()
    published?: boolean;

    @IsInt()
    authorId?: number;
}
