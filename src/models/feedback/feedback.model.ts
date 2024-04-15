import { ApiProperty } from "@nestjs/swagger";
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { User } from "../users/users.model";
import { Product } from "../product/product.model";
import { IFeedbackCreationAttrs } from "src/types/types";

@Table({ tableName: "feedback" })
export class Feedback extends Model<Feedback, IFeedbackCreationAttrs> {
  @ApiProperty({ example: "1", description: "Unique identifier" })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: "Text of Feedback", description: "Feedback text" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  text: string;

  @ApiProperty({ example: "4", description: "Feedback grade" })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  grade: number;

  @ApiProperty({ example: "link to image", description: "Feedback image" })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  image: string;

  @ApiProperty({ example: "1", description: "User Id of the testimonial" })
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @ApiProperty({
    example: "1",
    description: "Id of the product to which the comment was left",
  })
  @ForeignKey(() => Product)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  productId: number;

  @BelongsTo(() => User)
  author: User;

  @BelongsTo(() => Product)
  good: Product;
}
