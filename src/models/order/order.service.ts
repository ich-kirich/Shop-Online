import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CreateOrderDto, UpdateOrderDto } from "./dto/create-order.dto";
import { Order } from "./order.model";
import { OrderProduct } from "src/models/order-product.model";
import { Product } from "../product/product.model";
import { ORDER_STATUSES, ROLES } from "src/libs/constants";

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
      try {
        await OrderProduct.create({
          orderId: order.id,
          productId: productInfo.id,
          quantity: product.quantity,
          price: productInfo.price,
        });
      } catch (error) {
        throw new Error(
          `Failed to add product with this id: ${productInfo.id} to order`,
        );
      }
    }

    return order;
  }
  async getOrdersByUserId(id: number) {
    try {
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
    } catch (error) {
      console.error("Error fetching orders by user id:", error);
      throw new Error("Failed to fetch orders by user id");
    }
  }

  async updateOrder(userId: number, orderDto: UpdateOrderDto) {
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
        try {
          await OrderProduct.create({
            orderId: order.id,
            productId: product.id,
            quantity: product.quantity,
            price: productInfo.price,
          });
        } catch (error) {
          throw new Error(
            `Failed to add product with this id: ${product.id} to order`,
          );
        }
      }
      order.price = totalPrice;
      await order.save();
    }
    return order;
  }

  async deleteOrderById(number: number, role: string, userId: number) {
    if (role === ROLES.USER) {
      const order = await this.orderRepository.findOne({
        where: { userId, number },
      });

      if (!order) {
        throw new NotFoundException(
          `Order with this number ${number} not found`,
        );
      }

      if (order.status === ORDER_STATUSES.AWAITING_PROCESSING) {
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
