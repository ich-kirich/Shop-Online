import { Module, forwardRef } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "./users.model";
import { AuthModule } from "src/models/auth/auth.module";
import { Feedback } from "../feedback/feedback.model";
import { ImageService } from "src/libs/uploadImageApi";

@Module({
  controllers: [UsersController],
  providers: [UsersService, ImageService],
  imports: [
    SequelizeModule.forFeature([User, Feedback]),
    forwardRef(() => AuthModule),
  ],
  exports: [UsersService],
})
export class UsersModule {}
