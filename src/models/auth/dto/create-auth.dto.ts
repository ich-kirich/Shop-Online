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
