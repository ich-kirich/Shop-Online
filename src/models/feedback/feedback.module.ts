import { Module, forwardRef } from "@nestjs/common";
import { FeedbackService } from "./feedback.service";
import { FeedbackController } from "./feedback.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { Feedback } from "./feedback.model";
import { AuthModule } from "src/models/auth/auth.module";
import { Product } from "../product/product.model";
import { User } from "../users/users.model";

@Module({
  providers: [FeedbackService],
  controllers: [FeedbackController],
  imports: [
    SequelizeModule.forFeature([User, Feedback, Product]),
    forwardRef(() => AuthModule),
  ],
  exports: [FeedbackService],
})
export class FeedbackModule {}
