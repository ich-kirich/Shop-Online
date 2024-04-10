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
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

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

  @Get("/profile")
  async getUserProfile(@Req() req, @Body() requestBody: { id?: number }) {
    let userId = requestBody.id;
    let role;
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = this.jwtService.decode(token);
      if (decodedToken.role === "USER") {
        userId = Number(decodedToken.id);
      }
      role = decodedToken.role;
    }
    return this.userService.getUserById(userId, role);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @roles("ADMIN", "USER")
  @Post("/update")
  updateUser(@Req() req, @Body() userDto: updateUserDto) {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = this.jwtService.decode(token);
    let userId = Number(decodedToken.id);
    if (decodedToken.role === "ADMIN") {
      userId = Number(userDto.userId);
    }
    return this.userService.updateUser(userDto, userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @roles("ADMIN", "USER")
  @Delete("/delete")
  deleteUser(@Req() req, @Body() requestBody: { id: number }) {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = this.jwtService.decode(token);
    return this.userService.deleteUserById(
      requestBody.id,
      decodedToken.id,
      decodedToken.role,
    );
  }
}
