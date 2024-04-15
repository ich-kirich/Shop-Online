import { ApiProperty } from "@nestjs/swagger";
import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from "sequelize-typescript";
import { OrderProduct } from "src/models/order-product.model";
import { Feedback } from "../feedback/feedback.model";
import { Order } from "../order/order.model";
import { IProductCreationAttrs } from "src/types/types";
import { DEFAULT_IMAGE, UNKNOWN } from "src/libs/constants";

@Table({ tableName: "product" })
export class Product extends Model<Product, IProductCreationAttrs> {
  @ApiProperty({ example: "1", description: "Unique identifier" })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: "Product name", description: "Product name" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @ApiProperty({ example: "Product type", description: "Product type" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: UNKNOWN,
  })
  type: string;

  @ApiProperty({ example: "Product size", description: "Product size" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: UNKNOWN,
  })
  size: string;

  @ApiProperty({ example: "123.2", description: "Product price" })
  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  price: number;

  @ApiProperty({ example: "123.2", description: "Quantity of products" })
  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  quantity: number;

  @ApiProperty({ example: "link to image", description: "Product image" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: DEFAULT_IMAGE.PRODUCT_IMAGE,
  })
  image: string;

  @ApiProperty({
    example: "Product description",
    description: "Product description",
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: UNKNOWN,
  })
  description: string;

  @HasMany(() => Feedback)
  comments: Feedback[];

  @BelongsToMany(() => Order, () => OrderProduct)
  orders: Order[];
}
