import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UsersService } from "./users.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { User } from "./users.model";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { RolesGuard } from "src/auth/roles.guard";
import { roles } from "src/auth/roles-auth.decorator";
import { JwtService } from "@nestjs/jwt";
import { updateUserDto } from "src/types/types";

@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(private userService: UsersService, private jwtService: JwtService) {}

  @ApiOperation({ summary: "User Creation" })
  @ApiResponse({ status: 200, type: User })
  @Post()
  create(@Body() userDto: CreateUserDto) {
    return this.userService.createUser(userDto);
  }

  @ApiOperation({ summary: "Get All users" })
  @ApiResponse({ status: 200, type: [User] })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @roles("ADMIN")
  @Get()
  getAll() {
    return this.userService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @roles("ADMIN")
  @Get("/admProfile")
  getUserAdmin(@Body() requestBody: { id: number }) {
    return this.userService.getUserByIdAdmin(requestBody.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @roles("USER", "ADMIN")
  @Get("/userProfile")
  async getUserProfile(@Req() req) {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = this.jwtService.decode(token);
    return this.userService.getUserById(decodedToken.id);
  }

  @Get("/othersProfile")
  async getOthersProfile(@Body() requestBody: { id: number }) {
    return this.userService.getUserByIdOthers(requestBody.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @roles("ADMIN", "USER")
  @Post("/updateUser")
  updateUserAdmin(@Req() req, @Body() userDto: updateUserDto) {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = this.jwtService.decode(token);
    return this.userService.updateUser(userDto, decodedToken.id, decodedToken.role);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @roles("ADMIN", "USER")
  @Delete("/delete")
  deleteUser(@Req() req, @Body() requestBody: { id: number }) {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = this.jwtService.decode(token);
    return this.userService.deleteUserById(requestBody.id, decodedToken.id, decodedToken.role);
  }
}
