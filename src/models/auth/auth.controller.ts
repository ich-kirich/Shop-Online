import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { loginUserDto } from "src/types/types";
import { CreateUserDto } from "../users/dto/create-user.dto";

@ApiTags("Authorization")
@Controller("auth")
export class AuthController {

    constructor(private authService: AuthService){}

    @ApiOperation({summary: "Login"})
    @Post("/login")
    login(@Body() loginDto: loginUserDto) {
        return this.authService.login(loginDto)
    }

    @Post("/registration")
    registration(@Body() userDto: CreateUserDto) {
        return this.authService.registration(userDto)
    }
}