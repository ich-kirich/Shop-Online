import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class CreateFeedbackDto {
  @ApiProperty({ example: "Testimonial Text", description: "Feedback text" })
  @IsString({ message: "Should be a string" })
  readonly text: string;

  @ApiProperty({ example: "4", description: "Feedback grade" })
  @IsNumber({}, { message: "Should be a number" })
  @Min(1, { message: "Grade should not be less than 1" })
  @Max(5, { message: "Grade should not be greater than 5" })
  readonly grade: number;

  @ApiProperty({
    example: "1",
    description: "Id of the product to which the comment was left",
  })
  @IsNumber({}, { message: "Should be a number" })
  readonly productId: number;
}

export class UpdateFeedbackDto {
  @ApiProperty({ example: "1", description: "Id of Feedback" })
  @IsNumber({}, { message: "FeedbackId should be a number" })
  readonly feedbackId: number;

  @ApiProperty({ example: "4", description: "Feedback grade" })
  @IsNumber({}, { message: "New grade should be a number" })
  @Min(1, { message: "Grade should not be less than 1" })
  @Max(5, { message: "Grade should not be greater than 5" })
  @IsOptional()
  readonly newGrade: number;

  @ApiProperty({ example: "Text of feedback", description: "Text of feedback" })
  @IsString({ message: "New text should be a string" })
  @IsOptional()
  readonly newText: string;
}
