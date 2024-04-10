import { Module, forwardRef } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { Product } from "./product.model";
import { OrderProduct } from "src/models/order-product.model";
import { AuthModule } from "src/models/auth/auth.module";
import { Feedback } from "../feedback/feedback.model";
import { Order } from "../order/order.model";

@Module({
  providers: [ProductService],
  controllers: [ProductController],
  imports: [
    SequelizeModule.forFeature([Product, Feedback, Order, OrderProduct]),
    forwardRef(() => AuthModule),
  ],
  exports: [ProductService],
})
export class ProductModule {}
