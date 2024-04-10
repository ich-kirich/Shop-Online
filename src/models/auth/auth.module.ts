import { Module, forwardRef } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import config from "config";
import { UsersModule } from "../users/users.module";

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.register({
      secret: config.get("jwt.secretKey") || "SECRET_KEY",
      signOptions: {
        expiresIn: "24h",
      },
    }),
  ],
  exports: [AuthService, JwtModule]
})
export class AuthModule {}
