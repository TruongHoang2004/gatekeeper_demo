import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,


  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const {email, password: plainPassword} = createUserDto;
    const hashedPassword = plainPassword ? await this.hashPassword(plainPassword) : undefined;

    const emailExists = await this.usersRepository.findOne({where: {email}});
    if (emailExists) {
      throw new ConflictException('Email already exists');
    }
    
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    const savedUser = await this.usersRepository.save(user);
    const { password: _, ...result } = savedUser;
    return result as Omit<User, 'password'>;
  }
  
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  async findOneByEmail(email: string): Promise<Omit<User, 'password'>> {
    
    const user = await this.usersRepository.findOne({where: {email}});

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password: _, ...result } = user;
    return result as Omit<User, 'password'>;
  }

  async findOneById(id: number): Promise<Omit<User, 'password'>> {
    const user = await this.usersRepository.findOne({where: {id}});
    if
    (!user) {
      throw new NotFoundException('User not found');
    }
    const { password: _, ...result } = user;
    return result as Omit<User, 'password'>;
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.usersRepository.find();
    return users.map(({password, ...result}) => result as Omit<User, 'password'>);
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<Omit<User, 'password'>> {
    const {email, password: plainPassword} = updateUserDto;
    const hashedPassword = plainPassword ? await this.hashPassword(plainPassword) : undefined;

    const user = await this.usersRepository.findOne({where: {id}});

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const emailExists = await this.usersRepository.findOne({where: {email}});
    if (emailExists && emailExists.id !== id) {
      throw new ConflictException('Email already exists');
    }

    const updatedUser = await this.usersRepository.save({
      id,
      ...updateUserDto,
      password: hashedPassword,
    });

    const { password: _, ...result } = updatedUser;
    return result as Omit<User, 'password'>;
  }

}