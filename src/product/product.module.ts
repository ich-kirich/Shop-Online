import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from './product.model';
import { Feedback } from 'src/feedback/feedback.model';
import { Order } from 'src/order/order.model';
import { OrderProduct } from 'src/order-product.model';

@Module({
  providers: [ProductService],
  controllers: [ProductController],
  imports: [SequelizeModule.forFeature([Product, Feedback, Order, OrderProduct])],
  exports: [ProductService],
})
export class ProductModule {}
