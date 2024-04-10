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
  @IsNumber({}, { message: "FeedbackId should be a number" })
  readonly feedbackId: number;

  @ApiProperty({ example: "4", description: "Feedback grade" })
  @IsNumber({}, { message: "New grade should be a number" })
  @Min(1, { message: "Grade should not be less than 1" })
  @Max(5, { message: "Grade should not be greater than 5" })
  @IsOptional()
  readonly newGrade: number;

  @IsString({ message: "New text should be a string" })
  @IsOptional()
  readonly newText: string;
}

export class updateUserDto {
  @IsNumber({}, { message: "UserId should be a number" })
  @IsOptional()
  readonly userId: number;

  @IsString({ message: "Password should be a string" })
  @Length(4, 16, {
    message:
      "Password length must be at least 4 characters and no more than 16 characters long",
  })
  @IsOptional()
  readonly password: string;

  @IsString({ message: "Name should be a string" })
  @IsOptional()
  readonly name: string;

  @IsString({ message: "Image should be a string" })
  @IsOptional()
  readonly image: string;
}

export class updateProductDto {
  @IsNumber({}, { message: "Id should be a number" })
  readonly id: number;

  @IsString({ message: "Name should be a string" })
  @IsOptional()
  readonly name: string;

  @IsString({ message: "Type of Product should be a string" })
  @IsOptional()
  readonly type: string;

  @IsString({ message: "Size should be a string" })
  @IsOptional()
  readonly size: string;

  @IsNumber({}, { message: "Price should be a number" })
  @IsOptional()
  readonly price: number;

  @IsNumber({}, { message: "Quantity should be a number" })
  @IsOptional()
  readonly quantity: number;

  @IsString({ message: "Image should be a string" })
  @IsOptional()
  readonly image: string;

  @IsString({ message: "Description should be a string" })
  @IsOptional()
  readonly description: string;
}

export interface IOrderProduct {
  id: number;
  quantity: number;
}

export class updateOrderDto {
  @IsNumber({}, { message: "UserId should be a number" })
  @IsOptional()
  readonly userId: number;

  @IsString({ message: "Adress should be a string" })
  @IsOptional()
  readonly adress: string;

  @IsNumber({}, { message: "should be a number" })
  readonly number: number;

  @IsArray({
    message: "Must be an array of objects with 'id' and 'quantity' properties",
  })
  @ValidateNested({ each: true })
  @IsOptional()
  readonly products: IOrderProduct[];
}
