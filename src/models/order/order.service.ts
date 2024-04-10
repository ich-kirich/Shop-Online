import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CreateOrderDto } from "./dto/create-order.dto";
import { Order } from "./order.model";
import { OrderProduct } from "src/models/order-product.model";
import { updateOrderDto } from "src/types/types";
import { Product } from "../product/product.model";

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order) private orderRepository: typeof Order,
    @InjectModel(Product) private productRepository: typeof Product,
  ) {}

  async create(dto: CreateOrderDto) {
    const { products } = dto;
    let totalPrice = 0;

    const productsInfo = await this.productRepository.findAll({
      where: { id: products.map((product) => product.id) },
    });

    if (productsInfo.length !== products.length) {
      throw new Error("Some products were not found");
    }

    for (const productInfo of productsInfo) {
      const product = products.find((product) => product.id === productInfo.id);
      totalPrice += productInfo.price * product.quantity;
    }

    const order = await this.orderRepository.create({
      ...dto,
      price: totalPrice,
    });

    for (const productInfo of productsInfo) {
      const product = products.find((product) => product.id === productInfo.id);
      await OrderProduct.create({
        orderId: order.id,
        productId: productInfo.id,
        quantity: product.quantity,
        price: productInfo.price,
      });
    }

    return order;
  }

  async getOrdersByUserId(id: number) {
    const orders = await this.orderRepository.findAll({
      where: { userId: id },
      include: [
        {
          model: Product,
          attributes: [
            "id",
            "name",
            "type",
            "size",
            "price",
            "image",
            "description",
          ],
          through: { attributes: ["quantity"] },
        },
      ],
    });

    return orders;
  }

  async updateOrder(userId: number, orderDto: updateOrderDto) {
    const { adress, products, number } = orderDto;
    const order = await this.orderRepository.findOne({
      where: { userId, number },
    });
    if (!order) {
      throw new NotFoundException(`Order with number ${number} not found`);
    }

    if (adress !== undefined) {
      order.adress = adress;
      await order.save();
    }
    await OrderProduct.destroy({ where: { orderId: order.id } });
    if (products !== undefined) {
      let totalPrice = 0;
      for (const product of products) {
        const productInfo = await this.productRepository.findByPk(product.id);

        if (!productInfo) {
          throw new NotFoundException(
            `Product with id ${product.id} not found`,
          );
        }
        totalPrice += productInfo.price * product.quantity;

        await OrderProduct.create({
          orderId: order.id,
          productId: product.id,
          quantity: product.quantity,
          price: productInfo.price,
        });
      }
      order.price = totalPrice;
      await order.save();
    }
    return order;
  }

  async deleteOrderById(number: number, role: string, userId: number) {
    if (role === "USER") {
      const order = await this.orderRepository.findOne({
        where: { userId, number },
      });

      if (!order) {
        throw new NotFoundException(
          `Order with this number ${number} not found`,
        );
      }

      if (order.status === "Awaiting processing by a specialist") {
        const deletedOrder = await this.orderRepository.destroy({
          where: { number },
        });

        if (deletedOrder === 0) {
          throw new Error("Order not found");
        }

        return { success: true };
      }
    }

    const deletedOrder = await this.orderRepository.destroy({
      where: { number },
    });

    if (deletedOrder === 0) {
      throw new Error("Order not found");
    }

    return { success: true };
  }
}
