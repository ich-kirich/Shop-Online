import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";

export class CreateUserDto {
    @ApiProperty({example: "Medvedik@gmail.com", description: "User email"})
    @IsString({message: "Should be a string"})
    @IsEmail({}, {message: "Incorrect email"})
    readonly email: string;
    @ApiProperty({example: "StrongPassword", description: "User password"})
    @IsString({message: "Should be a string"})
    @Length(4, 16, {message: "Password length must be at least 4 characters and no more than 16 characters long"})
    readonly password: string;
    @ApiProperty({example: "Medvedik", description: "User Name"})
    @IsString({message: "Should be a string"})
    readonly name: string;
}