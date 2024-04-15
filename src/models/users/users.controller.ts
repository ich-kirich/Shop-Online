import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { Request } from "express";
import { CreateUserDto } from "./dto/create-user.dto";
import { UsersService } from "./users.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { User } from "./users.model";
import { JwtAuthGuard } from "src/models/auth/jwt-auth.guard";
import { RolesGuard } from "src/models/auth/roles.guard";
import { roles } from "src/models/auth/roles-auth.decorator";
import { JwtService } from "@nestjs/jwt";
import { updateUserDto } from "src/types/types";
import { ROLES } from "src/libs/constants";

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
  @roles(ROLES.ADMIN)
  @Get()
  getAll() {
    return this.userService.getAllUsers();
  }

  @ApiOperation({ summary: "Get User Profile" })
  @ApiResponse({ status: 200, type: User })
  @Get("/profile")
  async getUserProfile(
    @Req() req: Request,
    @Body() requestBody: { id?: number },
  ) {
    let userId = requestBody.id;
    let role: string;
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = this.jwtService.decode(token);
      if (decodedToken.role === ROLES.USER) {
        userId = Number(decodedToken.id);
      }
      role = decodedToken.role;
    }
    return this.userService.getUserById(userId, role);
  }

  @ApiOperation({ summary: "Update User Profile" })
  @ApiResponse({ status: 200, type: User })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @roles(ROLES.ADMIN, ROLES.USER)
  @Post("/update")
  updateUser(@Req() req: Request, @Body() userDto: updateUserDto) {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = this.jwtService.decode(token);
    let userId = Number(decodedToken.id);
    if (decodedToken.role === ROLES.ADMIN) {
      userId = Number(userDto.userId);
    }
    return this.userService.updateUser(userDto, userId);
  }

  @ApiOperation({ summary: "Delete User Profile" })
  @ApiResponse({ status: 200 })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @roles(ROLES.ADMIN, ROLES.USER)
  @Delete("/delete")
  deleteUser(@Req() req: Request, @Body() requestBody: { id: number }) {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = this.jwtService.decode(token);
    return this.userService.deleteUserById(
      requestBody.id,
      decodedToken.id,
      decodedToken.role,
    );
  }
}
