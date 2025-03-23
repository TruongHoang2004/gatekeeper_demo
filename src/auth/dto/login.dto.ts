import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({ example: 'john.doe@example.com', description: 'The email of the user' })
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'password123', description: 'The password of the user', minLength: 6 })
    @IsString()
    @MinLength(6)
    password: string;
}