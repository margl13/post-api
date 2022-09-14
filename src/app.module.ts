import { Module } from '@nestjs/common';
import { BlogModule } from './blog/BlogModule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './user/UsersModule';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/AuthModule';

@Module({
  imports: [
    BlogModule,
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
