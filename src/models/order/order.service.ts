import { Injectable, Logger, NotFoundException } from "@nestjs/common";
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

  private readonly logger = new Logger(OrderService.name);

  async create(dto: CreateOrderDto) {
    const { products } = dto;
    let totalPrice = 0;

    const productsInfo = await this.productRepository.findAll({
      where: { id: products.map((product) => product.id) },
    });

    if (productsInfo.length !== products.length) {
      this.logger.error(`Error getting products: ${productsInfo}`);
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
        this.logger.error(
          `Error adding product with this id: ${productInfo.id} to order`,
        );
        throw new Error(
          `Failed to add product with this id: ${productInfo.id} to order`,
        );
      }
    }
    this.logger.log(`Order created: ${order.id}`);
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
      this.logger.log(
        `Fetched ${orders.length} orders of user with this id: ${id}`,
      );
      return orders;
    } catch (error) {
      this.logger.error(
        `Error fetching orders by user id: ${id}: ${error.message}`,
      );
      throw new Error("Failed to fetch orders by user id");
    }
  }

  async updateOrder(userId: number, orderDto: UpdateOrderDto) {
    const { adress, products, number } = orderDto;
    const order = await this.orderRepository.findOne({
      where: { userId, number },
    });
    if (!order) {
      this.logger.error(`Order with number ${number} not found`);
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
          this.logger.error(`Product with id ${product.id} not found`);
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
          this.logger.error(
            `Failed to add product with this id: ${product.id} to order`,
          );
          throw new Error(
            `Failed to add product with this id: ${product.id} to order`,
          );
        }
      }
      order.price = totalPrice;
      await order.save();
    }
    this.logger.log(`Order with this id: ${order.id} was successfully updated`);
    return order;
  }

  async deleteOrderById(number: number, role: string, userId: number) {
    if (role === ROLES.USER) {
      const order = await this.orderRepository.findOne({
        where: { userId, number },
      });

      if (!order) {
        this.logger.error(`Order with this number ${number} not found`);
        throw new NotFoundException(
          `Order with this number ${number} not found`,
        );
      }

      if (order.status === ORDER_STATUSES.AWAITING_PROCESSING) {
        const deletedOrder = await this.orderRepository.destroy({
          where: { number },
        });

        if (deletedOrder === 0) {
          this.logger.error(`Error deleting order with this number: ${number}`);
          throw new Error("Order not found");
        }

        return { success: true };
      }
    }

    const deletedOrder = await this.orderRepository.destroy({
      where: { number },
    });

    if (deletedOrder === 0) {
      this.logger.error(`Error deleting order with this number: ${number}`);
      throw new Error("Order not found");
    }
    this.logger.log(`Order with this number: ${number} was successfully deleted`);
    return { success: true };
  }
}
