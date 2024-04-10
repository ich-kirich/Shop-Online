import { Module, forwardRef } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/users.model';
import { Order } from './order.model';
import { Product } from 'src/product/product.model';
import { OrderProduct } from 'src/order-product.model';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [OrderService],
  controllers: [OrderController],
  imports: [SequelizeModule.forFeature([User, Order, Product, OrderProduct]), forwardRef(() => AuthModule)],
})
export class OrderModule {}
