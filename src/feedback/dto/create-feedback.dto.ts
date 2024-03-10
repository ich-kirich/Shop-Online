import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateFeedbackDto {
    @ApiProperty({ example: "Testimonial Text", description: "Feedback text" })
    @IsString({message: "Should be a string"})
    readonly text: string;

    @ApiProperty({ example: "4", description: "Feedback grade" })
    @IsNumber({}, {message: "Should be a number"})
    readonly grade: number;

    @ApiProperty({example: "1", description: "User Id of the testimonial"})
    @IsNumber({}, {message: "Should be a number"})
    readonly userId: number;
}