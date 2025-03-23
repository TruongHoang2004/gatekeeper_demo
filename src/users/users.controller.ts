import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ForbiddenException, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { Roles } from 'src/auth/decorator/role.decorator';
import { UserRole } from './enum/role.enum';
import { Public } from 'src/auth/decorator/public.decorator';
import RequestWithUser from 'src/auth/requestWithUser.interface';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  @Public()
  @ApiOperation({ summary: 'Create a new user' })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @UseGuards(RoleGuard)
  @Roles(UserRole.Admin)
  @ApiBearerAuth('JWT-auth')
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  findAll() {
    return this.usersService.findAll();
  }


  @Get(':id')
  @ApiOperation({
    summary: 'ADMIN: /:id, USER: /me to get current user',
  })
  @ApiParam({ name: 'id', required: true })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 200,
    description: 'Return the user by ID.',
  })
  findMe(@Req() req: RequestWithUser, @Param('id') id: string) {
    if (id === 'me') {
      return this.usersService.findOneById(req.user.id);
    }
    if (req.user.role === UserRole.Admin) {
      return this.usersService.findOneById(+(id));
    }
    throw new ForbiddenException(
      "You don't have permission to access this resource",
    );
  }


  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', required: true })
  @ApiOperation({
    summary: 'ADMIN: /:id, USER: /me to update current user',
  })
  @ApiResponse({
    status: 200,
    description: 'Return the user updated by ID.',
  })
  update(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    if (id === 'me') {
      return this.usersService.update(req.user.id, updateUserDto);
    }
    // if (req.user.role === Role.ADMIN) {
    //   return this.usersService.update(+id, updateUserDto);
    // }
    throw new ForbiddenException(
      "You don't have permission to access this resource",
    );
  }


  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'ADMIN: /:id, USER: /me delete current user' })
  @ApiResponse({
    status: 200,
    description: 'Return the user deleted by ID.',
  })
  remove(@Req() req: RequestWithUser, @Param('id') id: string) {
    if (id === 'me') {
      return this.usersService.remove(req.user.id);
    }
    if (req.user.role === UserRole.Admin) {
      return this.usersService.remove(+id);
    }
    throw new ForbiddenException(
      "You don't have permission to access this resource",
    );
  }
}
