import { Module, forwardRef } from "@nestjs/common";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { Order } from "./order.model";
import { OrderProduct } from "src/models/order-product.model";
import { AuthModule } from "src/models/auth/auth.module";
import { Product } from "../product/product.model";
import { User } from "../users/users.model";

@Module({
  providers: [OrderService],
  controllers: [OrderController],
  imports: [
    SequelizeModule.forFeature([User, Order, Product, OrderProduct]),
    forwardRef(() => AuthModule),
  ],
})
export class OrderModule {}
