import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { IOrderProduct } from "src/interrfaces/interrfaces";

class OrderProductDto {
  @ApiProperty({ example: 1, description: "Product ID" })
  readonly id: number;

  @ApiProperty({ example: 32, description: "Product quantity" })
  readonly quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ example: "Order number", description: "Order number" })
  @IsNumber({}, { message: "Should be a number" })
  readonly number: number;

  @ApiProperty({ example: "Delivery address", description: "Delivery address" })
  @IsString({ message: "Should be a string" })
  readonly adress: string;

  @ApiProperty({ example: "Order status", description: "Order status" })
  @IsString({ message: "Should be a string" })
  @IsOptional()
  readonly status: string;

  @ApiProperty({ example: "1", description: "User Id of the testimonial" })
  @IsNumber({}, { message: "Should be a number" })
  readonly userId: number;

  @ApiProperty({
    example: "[{ id: 1, quantity: 32}, { id: 2, quantity: 519}]",
    description: "Array of products to order",
  })
  @IsArray({
    message: "Must be an array of objects with 'id' and 'quantity' properties",
  })
  @ValidateNested({ each: true })
  @Type(() => OrderProductDto)
  readonly products: IOrderProduct[];
}

export class UpdateOrderDto {
  @ApiProperty({
    example: "1",
    description: "User id of the user who placed the order",
  })
  @IsNumber({}, { message: "UserId should be a number" })
  @IsOptional()
  readonly userId: number;

  @ApiProperty({
    example: "123 Street, City, Country",
    description: "Shipping address",
  })
  @IsString({ message: "Adress should be a string" })
  @IsOptional()
  readonly adress: string;

  @ApiProperty({ example: "1001", description: "Number of order" })
  @IsNumber({}, { message: "should be a number" })
  readonly number: number;

  @ApiProperty({
    example: "[{ id: 1, quantity: 32}, { id: 2, quantity: 519}]",
    description: "Array of products to order",
  })
  @IsArray({
    message: "Must be an array of objects with 'id' and 'quantity' properties",
  })
  @ValidateNested({ each: true })
  @IsOptional()
  readonly products: IOrderProduct[];
}
