import { Module, forwardRef } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "./users.model";
import { AuthModule } from "src/auth/auth.module";
import { Feedback } from "src/feedback/feedback.model";
import { OrderModule } from "src/order/order.module";

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [SequelizeModule.forFeature([User, Feedback]), forwardRef(() => AuthModule)],
  exports: [UsersService],
})
export class UsersModule {}
