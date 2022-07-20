import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from './guards/jwt-guard';
import { JwtStrategy } from './guards/jwt-strategy';

import { UsersModule } from '../user/UsersModule';
import { AuthController } from './AuthController';
import { AuthService } from './services/AuthService';
import { UsersService } from '../user/services/UsersService';
import { UserEntity } from '../user/entities/UserEntity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    forwardRef(() => UsersModule),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('SECRET_KEY'),
        signOptions: { expiresIn: '10000s' },
      }),
    }),
  ],
  providers: [AuthService, JwtAuthGuard, JwtStrategy, UsersService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
