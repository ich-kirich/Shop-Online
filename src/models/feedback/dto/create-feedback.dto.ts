import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, Max, Min } from "class-validator";

export class CreateFeedbackDto {
    @ApiProperty({ example: "Testimonial Text", description: "Feedback text" })
    @IsString({message: "Should be a string"})
    readonly text: string;

    @ApiProperty({ example: "4", description: "Feedback grade" })
    @IsNumber({}, {message: "Should be a number"})
    @Min(1, { message: "Grade should not be less than 1" })
    @Max(5, { message: "Grade should not be greater than 5" })
    readonly grade: number;

    @ApiProperty({example: "1", description: "Id of the product to which the comment was left"})
    @IsNumber({}, {message: "Should be a number"})
    readonly productId: number;
}