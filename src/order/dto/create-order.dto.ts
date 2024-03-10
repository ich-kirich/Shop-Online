import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateOrderDto {
    @ApiProperty({ example: "Order number", description: "Order number" })
    @IsNumber({}, {message: "Should be a number"})
    readonly number: string;

    @ApiProperty({ example: "123.2", description: "Total order amount" })
    @IsNumber({}, {message: "Should be a number"})
    readonly price: number;

    @ApiProperty({ example: "Delivery address", description: "Delivery address" })
    @IsString({message: "Should be a string"})
    readonly adress: string;

    @ApiProperty({ example: "Order status", description: "Order status" })
    @IsString({message: "Should be a string"})
    readonly status: string;

    @ApiProperty({ example: "Belarus", description: "Country from where the order was placed" })
    @IsString({message: "Should be a string"})
    readonly country: string;

    @ApiProperty({example: "1", description: "User Id of the testimonial"})
    @IsNumber({}, {message: "Should be a number"})
    readonly userId: number;
}