import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import { TokenPayload } from './tokenPayload.interface';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET') || 'defaultSecret',
    });
  }

  async validate(payload: TokenPayload): Promise<{
    user: Omit<User, 'password'>;
  }> {
    const user = await this.usersService.findOneById(payload.userId);

    // console.log('payload', user);
    if (!user) {
      throw new UnauthorizedException('Unauthorized at strategy');
    }

    // console.log(user);

    return {
      user: user,
    }; //Mặc định gắn vào request.user
  }
}