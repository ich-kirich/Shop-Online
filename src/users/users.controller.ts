import { Body, Controller, Get, Post, UseGuards, UsePipes } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UsersService } from "./users.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { User } from "./users.model";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { RolesGuard } from "src/auth/roles.guard";
import { roles } from "src/auth/roles-auth.decorator";
import { ValidationPipe } from "src/pipes/validation.pipe";

@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(private userService: UsersService) {}

  @ApiOperation({summary: "User Creation"})
  @ApiResponse({status: 200, type: User})
  @Post()
  create(@Body() userDto: CreateUserDto) {
    return this.userService.createUser(userDto);
  }

  @ApiOperation({summary: "Get All users"})
  @ApiResponse({status: 200, type: [User]})
  @UseGuards(JwtAuthGuard, RolesGuard)
  @roles("ADMIN")
  @Get()
  getAll() {
    return this.userService.getAllUsers();
  }
}
