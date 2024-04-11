import { ApiProperty } from "@nestjs/swagger";
import {
  IsArray,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
  ValidateNested,
} from "class-validator";

export class loginUserDto {
  @ApiProperty({ example: "Medvedik@gmail.com", description: "User email" })
  @IsString({ message: "Email should be a string" })
  @IsEmail({}, { message: "Incorrect email" })
  readonly email: string;

  @ApiProperty({ example: "StrongPassword", description: "User password" })
  @IsString({ message: "Password should be a string" })
  @Length(4, 16, {
    message:
      "Password length must be at least 4 characters and no more than 16 characters long",
  })
  readonly password: string;
}

export class updateFeedbackDto {
  @ApiProperty({ example: "1", description: "Id of Feedback" })
  @IsNumber({}, { message: "FeedbackId should be a number" })
  readonly feedbackId: number;

  @ApiProperty({ example: "4", description: "Feedback grade" })
  @IsNumber({}, { message: "New grade should be a number" })
  @Min(1, { message: "Grade should not be less than 1" })
  @Max(5, { message: "Grade should not be greater than 5" })
  @IsOptional()
  readonly newGrade: number;

  @ApiProperty({ example: "Text of feedback", description: "Text of feedback" })
  @IsString({ message: "New text should be a string" })
  @IsOptional()
  readonly newText: string;
}

export class updateUserDto {
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

export class updateProductDto {
  @ApiProperty({ example: "1", description: "Id of product" })
  @IsNumber({}, { message: "Id should be a number" })
  readonly id: number;

  @ApiProperty({ example: "Table", description: "Name of product" })
  @IsString({ message: "Name should be a string" })
  @IsOptional()
  readonly name: string;

  @ApiProperty({ example: "Accessories", description: "Type of product" })
  @IsString({ message: "Type of Product should be a string" })
  @IsOptional()
  readonly type: string;

  @ApiProperty({ example: "12 cm", description: "Size of product" })
  @IsString({ message: "Size should be a string" })
  @IsOptional()
  readonly size: string;

  @ApiProperty({ example: "12", description: "Price of product" })
  @IsNumber({}, { message: "Price should be a number" })
  @IsOptional()
  readonly price: number;

  @ApiProperty({ example: "100", description: "Quantity of product" })
  @IsNumber({}, { message: "Quantity should be a number" })
  @IsOptional()
  readonly quantity: number;

  @ApiProperty({ example: "link to image", description: "Image of product" })
  @IsString({ message: "Image should be a string" })
  @IsOptional()
  readonly image: string;

  @ApiProperty({ example: "This is a table", description: "Description of product" })
  @IsString({ message: "Description should be a string" })
  @IsOptional()
  readonly description: string;
}

export interface IOrderProduct {
  id: number;
  quantity: number;
}

export class updateOrderDto {
  @ApiProperty({ example: "1", description: "User id of the user who placed the order" })
  @IsNumber({}, { message: "UserId should be a number" })
  @IsOptional()
  readonly userId: number;

  @ApiProperty({ example: "123 Street, City, Country", description: "Shipping address" })
  @IsString({ message: "Adress should be a string" })
  @IsOptional()
  readonly adress: string;

  @ApiProperty({ example: "1001", description: "Number of order" })
  @IsNumber({}, { message: "should be a number" })
  readonly number: number;

  @ApiProperty({ example: "[{ id: 1, quantity: 32}, { id: 2, quantity: 519}]", description: "Array of products to order" })
  @IsArray({
    message: "Must be an array of objects with 'id' and 'quantity' properties",
  })
  @ValidateNested({ each: true })
  @IsOptional()
  readonly products: IOrderProduct[];
}
