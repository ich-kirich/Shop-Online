import { ApiProperty } from "@nestjs/swagger";
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { User } from "src/users/users.model";

interface FeedbackCreationAttrs {
  text: string;
  grade: number;
  userId: number;
}

@Table({ tableName: "feedback" })
export class Feedback extends Model<Feedback, FeedbackCreationAttrs> {
  @ApiProperty({ example: "1", description: "Unique identifier" })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: "Testimonial Text", description: "Feedback text" })
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
    allowNull: false,
    defaultValue: "Unknown",
  })
  image: string;

  @ApiProperty({ example: "1", description: "User Id of the testimonial" })
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  userId: number;

  @BelongsTo(() => User)
  author: User;
}
