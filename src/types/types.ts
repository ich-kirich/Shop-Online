import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNumber, IsString, Length, Max, Min } from "class-validator";

export class loginUserDto {
    @ApiProperty({example: "Medvedik@gmail.com", description: "User email"})
    @IsString({message: "Should be a string"})
    @IsEmail({}, {message: "Incorrect email"})
    readonly email: string;

    @ApiProperty({example: "StrongPassword", description: "User password"})
    @IsString({message: "Should be a string"})
    @Length(4, 16, {message: "Password length must be at least 4 characters and no more than 16 characters long"})
    readonly password: string;
}

export class updateFeedbackDto {
    @IsNumber({}, {message: "Should be a number"})
    readonly feedbackId: number;

    @IsNumber({}, {message: "Should be a number"})
    readonly userId: number;
    
    @ApiProperty({ example: "4", description: "Feedback grade" })
    @IsNumber({}, {message: "Should be a number"})
    @Min(1, { message: "Grade should not be less than 1" })
    @Max(5, { message: "Grade should not be greater than 5" })
    readonly newGrade: number;

    @IsString({message: "Should be a string"})
    readonly newText: string;
}