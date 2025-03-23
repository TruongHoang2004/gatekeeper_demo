import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { UserRole } from 'src/users/enum/role.enum';
import { RoleGuard } from '../guard/role.guard';


export function RolesGuard(roles: UserRole[]) {
  return applyDecorators(SetMetadata('roles', roles), UseGuards(RoleGuard));
}