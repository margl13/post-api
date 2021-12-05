import { Module } from '@nestjs/common';
import {BlogModule} from "./blog/BlogModule";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UsersModule} from "./user/UsersModule";


@Module({
  imports: [
      BlogModule,
      UsersModule,
      TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'blog-user',
          password: 'pass',
          database: 'blog-app',
          entities: [__dirname + '/**/*Entity{.ts,.js}'],
          synchronize: true,
      }),
      TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'blog-user',
          password: 'pass',
          database: 'users',
          entities: [__dirname + '/**/*Entity{.ts,.js}'],
          synchronize: true,
      }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
