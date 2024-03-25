import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CreateOrderDto } from "./dto/create-order.dto";
import { Order } from "./order.model";

@Injectable()
export class OrderService {
  constructor(@InjectModel(Order) private orderRepository: typeof Order) {}

  async create(dto: CreateOrderDto) {
    const feedback = await this.orderRepository.create(dto);
    return feedback;
  }

  async getOrderByUserId(id: number) {
    const feedback = await this.orderRepository.findOne({
      where: { userId: id },
      include: { all: true },
    });
    return feedback;
  }
}
