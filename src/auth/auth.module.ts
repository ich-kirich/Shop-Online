import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UsersModule } from "src/users/users.module";
import { JwtModule } from "@nestjs/jwt";
import config from "config";

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    UsersModule,
    JwtModule.register({
      privateKey: config.get("jwt.secretKey") || "SECRET_KEY",
      signOptions: {
        expiresIn: "24h",
      },
    }),
  ],
})
export class AuthModule {}
