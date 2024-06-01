import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProductDto {
  @ApiProperty({ example: "Product name", description: "Product name" })
  @IsString({ message: "Should be a string" })
  readonly name: string;

  @ApiProperty({ example: "4", description: "Product price" })
  @IsNumber({}, { message: "Should be a number" })
  readonly price: number;

  @ApiProperty({ example: "1321.1", description: "Quantity of products" })
  @IsNumber({}, { message: "Should be a number" })
  readonly quantity: number;
}

export class UpdateProductDto {
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

  @ApiProperty({
    example: "This is a table",
    description: "Description of product",
  })
  @IsString({ message: "Description should be a string" })
  @IsOptional()
  readonly description: string;
}
