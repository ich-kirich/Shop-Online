import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { Order } from "./order/order.model";
import { Product } from "./product/product.model";
import { ApiProperty } from "@nestjs/swagger";

@Table({ tableName: "order_product" })
export class OrderProduct extends Model<OrderProduct> {
  @ApiProperty({ example: "1", description: "Unique identifier" })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: "1323", description: "Quantity of products" })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  quantity: number;

  @ApiProperty({ example: "1000", description: "Price of product" })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  price: number;

  @ForeignKey(() => Product)
  @Column({ type: DataType.INTEGER })
  productId: number;

  @ForeignKey(() => Order)
  @Column({ type: DataType.INTEGER })
  orderId: number;
}
