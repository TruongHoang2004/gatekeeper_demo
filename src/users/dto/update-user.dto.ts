import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { UserRole } from '../enum/role.enum';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    role?: UserRole;
}
