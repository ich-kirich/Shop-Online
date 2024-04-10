import { ApiProperty } from "@nestjs/swagger";
import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { OrderProduct } from "src/models/order-product.model";
import { Product } from "../product/product.model";
import { User } from "../users/users.model";

interface OrderCreationAttrs {
  number: number;
  price: number;
  adress: string;
  status: string;
  country: string;
  userId: number;
}

@Table({ tableName: "order" })
export class Order extends Model<Order, OrderCreationAttrs> {
  @ApiProperty({ example: "1", description: "Unique identifier" })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: "Order number", description: "Order number" })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    unique: true,
  })
  number: number;

  @ApiProperty({
    example: "2024-03-04 08:59:04.341+00",
    description: "Order date",
  })
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: new Date(),
  })
  date: Date;

  @ApiProperty({ example: "123.2", description: "Total order amount" })
  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  price: number;

  @ApiProperty({ example: "Delivery address", description: "Delivery address" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  adress: string;

  @ApiProperty({ example: "Order status", description: "Order status" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: "Awaiting processing by a specialist"
  })
  status: string;

  @ApiProperty({ example: "1", description: "User Id of the order" })
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    onDelete: "CASCADE",
  })
  userId: number;

  @BelongsTo(() => User)
  author: User;

  @BelongsToMany(() => Product, () => OrderProduct)
  products: Product[];
}
