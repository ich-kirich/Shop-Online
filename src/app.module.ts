import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import config from "config";
import { OrderProduct } from "./models/order-product.model";
import { AuthModule } from "./models/auth/auth.module";
import { Feedback } from "./models/feedback/feedback.model";
import { FeedbackModule } from "./models/feedback/feedback.module";
import { Order } from "./models/order/order.model";
import { OrderModule } from "./models/order/order.module";
import { Product } from "./models/product/product.model";
import { ProductModule } from "./models/product/product.module";
import { User } from "./models/users/users.model";
import { UsersModule } from "./models/users/users.module";
import { DB } from "./libs/constants";

@Module({
  controllers: [],
  providers: [],
  imports: [
    SequelizeModule.forRoot({
      dialect: config.get(DB.DIALECT),
      host: String(config.get(DB.HOST)),
      port: Number(config.get(DB.PORT)),
      username: String(config.get(DB.USERNAME)),
      password: String(config.get(DB.PASSWORD)),
      database: String(config.get(DB.DATABASE)),
      models: [User, Feedback, Product, Order, OrderProduct],
      autoLoadModels: true,
    }),
    UsersModule,
    AuthModule,
    FeedbackModule,
    OrderModule,
    ProductModule,
  ],
})
export class AppModule {}
