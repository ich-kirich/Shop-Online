import { Module, forwardRef } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from './product.model';
import { Feedback } from 'src/feedback/feedback.model';
import { Order } from 'src/order/order.model';
import { OrderProduct } from 'src/order-product.model';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [ProductService],
  controllers: [ProductController],
  imports: [SequelizeModule.forFeature([Product, Feedback, Order, OrderProduct]), forwardRef(() => AuthModule)],
  exports: [ProductService],
})
export class ProductModule {}
