import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { IOrderProduct } from "src/types/types";

export class CreateOrderDto {
    @ApiProperty({ example: "Order number", description: "Order number" })
    @IsNumber({}, {message: "Should be a number"})
    readonly number: number;

    @ApiProperty({ example: "Delivery address", description: "Delivery address" })
    @IsString({message: "Should be a string"})
    readonly adress: string;

    @ApiProperty({ example: "Order status", description: "Order status" })
    @IsString({message: "Should be a string"})
    @IsOptional()
    readonly status: string;

    @ApiProperty({example: "1", description: "User Id of the testimonial"})
    @IsNumber({}, {message: "Should be a number"})
    readonly userId: number;


    @ApiProperty({example: "[{ id: 1, quantity: 32}, { id: 2, quantity: 519}]", description: "Array of products to order"})
    @IsArray({message: "Must be an array of objects with 'id' and 'quantity' properties"})
    @ValidateNested({ each: true })
    readonly products: IOrderProduct[];
}