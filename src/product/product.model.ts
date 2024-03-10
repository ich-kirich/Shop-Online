import { ApiProperty } from "@nestjs/swagger";
import {
  Column,
  DataType,
  Model,
  Table,
} from "sequelize-typescript";

interface ProductCreationAttrs {
  name: string;
  price: number;
  quantity: number;
}

@Table({ tableName: "product" })
export class Product extends Model<Product, ProductCreationAttrs> {
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
    defaultValue: "Unknown",
  })
  type: string;

  @ApiProperty({ example: "Product size", description: "Product size" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: "Unknown",
  })
  size: string;

  @ApiProperty({ example: "123.2", description: "Product price" })
  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  price: number;

  @ApiProperty({ example: "123.2", description: "Quantity of goods" })
  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  quantity: number;

  @ApiProperty({ example: "link to image", description: "Product image" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: "Unknown",
  })
  image: string;

  @ApiProperty({ example: "Product description", description: "Product description" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: "Unknown",
  })
  description: string;
}