import { IsString, IsEmail, IsNotEmpty, MinLength, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../enum/role.enum';

export class CreateUserDto {
    @ApiProperty({ example: 'john_doe' })
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    fullname: string;

    @ApiProperty({ example: 'john.doe@example.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'password123' })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @ApiProperty({ example: UserRole.Author })
    @IsEnum(UserRole)
    role: UserRole;
}
