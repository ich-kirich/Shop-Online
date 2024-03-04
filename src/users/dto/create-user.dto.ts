import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({example: "Medvedik@gmail.com", description: "User email"})
    readonly email: string;
    @ApiProperty({example: "StrongPassword", description: "User password"})
    readonly passsword: string;
    @ApiProperty({example: "Medvedik", description: "User Name"})
    readonly name: string;
}