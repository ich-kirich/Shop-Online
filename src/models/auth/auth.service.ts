import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { loginUserDto } from "src/types/types";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { User } from "../users/users.model";
import { UsersService } from "../users/users.service";

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(userDto: loginUserDto) {
    try {
      const user = await this.validateUser(userDto);
      return this.generateToken(user);
    } catch (error) {
      console.error("Error during user validation:", error);
      throw new UnauthorizedException("Invalid email or password");
    }
  }

  async registration(userDto: CreateUserDto) {
    const candidate = await this.userService.getUserByEmail(userDto.email);
    if (candidate) {
      throw new HttpException(
        "A user with this email already exists",
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashPassword = await bcrypt.hash(userDto.password, 5);
    try {
      const user = await this.userService.createUser({
        ...userDto,
        password: hashPassword,
      });
      return this.generateToken(user);
    } catch (error) {
      console.error("Error during user registration:", error);
      throw new InternalServerErrorException(error);
    }
  }

  private async generateToken(user: User) {
    try {
      const { id, email, password, role } = user;
      const payload = { id, email, password, role };
      return {
        token: this.jwtService.sign(payload),
      };
    } catch (error) {
      console.error("Error during token generation:", error);
      throw new InternalServerErrorException("Failed to generate token");
    }
  }

  private async validateUser(userDto: loginUserDto) {
    const user = await this.userService.getUserByEmail(userDto.email);
    if (!user) {
      throw new UnauthorizedException({ message: "User not found" });
    }
    const passwordEquals = await bcrypt.compare(
      userDto.password,
      user.password,
    );
    if (!passwordEquals) {
      throw new UnauthorizedException({ message: "Invalid password" });
    }
    return user;
  }
}
