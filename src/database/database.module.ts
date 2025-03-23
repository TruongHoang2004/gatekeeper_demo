import { Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                const logger = new Logger('DatabaseModule');
                const config: TypeOrmModuleOptions = {
                    type: 'postgres',
                    host: configService.get<string>('DATABASE_HOST'),
                    port: configService.get<number>('DATABASE_PORT'),
                    username: configService.get<string>('DATABASE_USER'),
                    password: configService.get<string>('DATABASE_PASSWORD'),
                    database: configService.get<string>('DATABASE_NAME'),
                    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
                    synchronize: true,
                };
                logger.log('Database connection configuration loaded');
                return config;
            },
            inject: [ConfigService],
        }),
    ],
})
export class DatabaseModule {}