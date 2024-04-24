import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { CreateUserDto, UpdateUserDto } from "./dto/create-user.dto";
import { UsersService } from "./users.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { User } from "./users.model";
import { JwtAuthGuard } from "src/models/auth/jwt-auth.guard";
import { RolesGuard } from "src/models/auth/roles.guard";
import { roles } from "src/models/auth/roles-auth.decorator";
import { ROLES } from "src/constants";
import { FileInterceptor } from "@nestjs/platform-express";
import { RequestWithUser } from "src/interrfaces/interrfaces";

@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(private userService: UsersService) {}

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
    @Req() req: RequestWithUser,
    @Body() requestBody: { id?: number },
  ) {
    let userId = requestBody.id;
    let role: string;
    const user = req.user;
    if (user) {
      if (user.role === ROLES.USER) {
        userId = Number(user.id);
      }
      role = user.role;
    }
    return this.userService.getUserById(userId, role);
  }

  @ApiOperation({ summary: "Update User Profile" })
  @ApiResponse({ status: 200, type: User })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @roles(ROLES.ADMIN, ROLES.USER)
  @UseInterceptors(FileInterceptor("imageFile"))
  @Post("/update")
  updateUser(
    @Req() req: RequestWithUser,
    @Body() userDto?: UpdateUserDto,
    @UploadedFile() imageFile?: Express.Multer.File,
  ) {
    const user = req.user;
    let userId = Number(user.id);
    if (user.role === ROLES.ADMIN) {
      userId = Number(userDto.userId);
    }
    return this.userService.updateUser(userDto, userId, imageFile);
  }

  @ApiOperation({ summary: "Delete User Profile" })
  @ApiResponse({ status: 200 })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @roles(ROLES.ADMIN, ROLES.USER)
  @Delete("/delete")
  deleteUser(@Req() req: RequestWithUser, @Body() requestBody: { id: number }) {
    const user = req.user;
    return this.userService.deleteUserById(requestBody.id, user.id, user.role);
  }
}
