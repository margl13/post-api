import {forwardRef, Module} from "@nestjs/common";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {AuthService} from "./services/AuthService";
import {RolesGuard} from "./guards/roles.guard";
import {JwtAuthGuard} from "./guards/jwt-guard";
import {JwtSrtategy} from "./guards/jwt-srtategy";
import {UsersModule} from "../user/UsersModule";

@Module({
    imports: [
        forwardRef(() => UsersModule),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('SECRET_KEY'),
                signOptions: {expiresIn: '10000s'}
            })
        })
    ],
    providers: [AuthService, RolesGuard, JwtAuthGuard, JwtSrtategy],
    exports: [AuthService]
})
export class AuthModule { }