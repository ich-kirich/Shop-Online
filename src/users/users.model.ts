import { ApiProperty } from "@nestjs/swagger";
import { Column, DataType, Model, Table } from "sequelize-typescript";

interface UserCreationAttrs {
    email: string;
    password: string;
}

@Table({ tableName: "users" })
export class User extends Model<User, UserCreationAttrs> {
  @ApiProperty({example: "1", description: "Unique identifier"})
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;
  @ApiProperty({example: "Medvedik", description: "User Name"})
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;
  @ApiProperty({example: "Medvedik@gmail.com", description: "User email"})
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;
  @ApiProperty({example: "StrongPassword", description: "User password"})
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;
  @ApiProperty({example: "USER", description: "User access level"})
  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: "USER"
  })
  role: string;
  @ApiProperty({example: "link to image", description: "User image"})
  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: "USER"
  })
  image: string;
}
