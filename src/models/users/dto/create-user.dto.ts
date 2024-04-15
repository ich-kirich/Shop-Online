import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from "class-validator";

export class CreateUserDto {
  @ApiProperty({ example: "Medvedik@gmail.com", description: "User email" })
  @IsString({ message: "Should be a string" })
  @IsEmail({}, { message: "Incorrect email" })
  readonly email: string;
  @ApiProperty({ example: "StrongPassword", description: "User password" })
  @IsString({ message: "Should be a string" })
  @Length(4, 16, {
    message:
      "Password length must be at least 4 characters and no more than 16 characters long",
  })
  readonly password: string;
  @ApiProperty({ example: "Medvedik", description: "User Name" })
  @IsString({ message: "Should be a string" })
  readonly name: string;
}

export class UpdateUserDto {
  @ApiProperty({ example: "1", description: "Id of User" })
  @IsNumber({}, { message: "UserId should be a number" })
  @IsOptional()
  readonly userId: number;

  @ApiProperty({ example: "12345", description: "Password of User" })
  @IsString({ message: "Password should be a string" })
  @Length(4, 16, {
    message:
      "Password length must be at least 4 characters and no more than 16 characters long",
  })
  @IsOptional()
  readonly password: string;

  @ApiProperty({ example: "Billy", description: "Username" })
  @IsString({ message: "Name should be a string" })
  @IsOptional()
  readonly name: string;

  @ApiProperty({ example: "link to image", description: "Image" })
  @IsString({ message: "Image should be a string" })
  @IsOptional()
  readonly image: string;
}
