import { Module, forwardRef } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import config from "config";
import { UsersModule } from "../users/users.module";
import { JWT } from "src/libs/constants";

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.register({
      secret: config.get(JWT.SECRET_KEY),
      signOptions: {
        expiresIn: config.get(JWT.EXPIRES_IN),
      },
    }),
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
