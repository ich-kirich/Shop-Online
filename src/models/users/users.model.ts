import { ApiProperty } from "@nestjs/swagger";
import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { Feedback } from "../feedback/feedback.model";
import { Order } from "../order/order.model";
import { IUserCreationAttrs } from "src/interrfaces/interrfaces";
import { DEFAULT_IMAGE, ROLES, UNKNOWN_VALUE } from "src/constants";

@Table({ tableName: "users" })
export class User extends Model<User, IUserCreationAttrs> {
  @ApiProperty({ example: "1", description: "Unique identifier" })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: "Medvedik", description: "User Name" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @ApiProperty({ example: "Medvedik@gmail.com", description: "User email" })
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;

  @ApiProperty({ example: "StrongPassword", description: "User password" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @ApiProperty({ example: "USER", description: "User access level" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: ROLES.USER,
  })
  role: string;

  @ApiProperty({ example: "link to image", description: "User image" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: DEFAULT_IMAGE.USER_IMAGE,
  })
  image: string;

  @ApiProperty({
    example: "Saved delivery adresses",
    description: "User adresses",
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: UNKNOWN_VALUE,
  })
  adresses: string;

  @HasMany(() => Feedback)
  feedback: Feedback[];

  @HasMany(() => Order)
  order: Order[];
}
