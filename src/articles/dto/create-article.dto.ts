import { IsString, IsBoolean, IsOptional, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateArticleDto {
    @ApiProperty({ example: 'My First Article' })
    @IsString()
    title: string;

    @ApiProperty({ example: 'This is the content of the article.' })
    @IsString()
    content: string;

    @ApiProperty({ example: true, required: false })
    @IsOptional()
    @IsBoolean()
    published?: boolean;

    @ApiProperty({ example: 1, required: false })
    @IsInt()
    authorId: number | null;
}
