import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ArticlesModule } from './articles/articles.module';
import { DatabaseModule } from './database/database.module';
import { JwtAuthGuard } from './auth/guard/jwt-authentication.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [UsersModule, AuthModule, ArticlesModule, DatabaseModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
