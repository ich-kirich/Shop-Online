import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";

export class LoginUserDto {
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

export class ResultAuthorizationDto {
  @ApiProperty({
    example:
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ1ZGlsc2hjaGlrQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiJDJhJDA1JFA1bUlDaTdWUVBuQVVhQ2hqUW9kaE9vYTBJUzE5QjNHMmg1WVVhVzVOcUVYQWlXRWtlZEdTIiwicm9sZSI6IkF123TUlOIiwiaWF0IjoxNzEzMjkyNTI2LCJleHAiOjE3MTMzNzg5MjZ9.x3YO0N8Td1yBLAIH5zNpM-6KKao5d65tMk67nrtJoak",
    description: "Jwt token",
  })
  @IsString({ message: "Token should be a string" })
  readonly token: string;
}
