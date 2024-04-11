import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateProductDto {
    @ApiProperty({ example: "Product name", description: "Product name" })
    @IsString({message: "Should be a string"})
    readonly name: string;

    @ApiProperty({ example: "4", description: "Product price" })
    @IsNumber({}, {message: "Should be a number"})
    readonly price: number;

    @ApiProperty({example: "1321.1", description: "Quantity of products"})
    @IsNumber({}, {message: "Should be a number"})
    readonly quantity: number;
}