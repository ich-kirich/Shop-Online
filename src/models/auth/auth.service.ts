import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { User } from "../users/users.model";
import { UsersService } from "../users/users.service";
import { LoginUserDto } from "./dto/create-auth.dto";

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  private readonly logger = new Logger(AuthService.name);

  async login(userDto: LoginUserDto) {
    try {
      const user = await this.validateUser(userDto);
      this.logger.log(`User with this id: ${user.id} logged in`);
      return this.generateToken(user);
    } catch (error) {
      this.logger.error(`Error during user validation: ${error.message}`);
      throw new UnauthorizedException("Invalid email or password");
    }
  }

  async registration(userDto: CreateUserDto) {
    const candidate = await this.userService.getUserByEmail(userDto.email);
    if (candidate) {
      this.logger.error(
        `A user with this email: ${userDto.email} already exists`,
      );
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
      this.logger.log(`User with this id: ${user.id} was registered`);
      return this.generateToken(user);
    } catch (error) {
      this.logger.error(`Error during user registration: ${error.message}`);
      throw new InternalServerErrorException(error);
    }
  }

  private async generateToken(user: User) {
    try {
      const { id, email, password, role } = user;
      const payload = { id, email, password, role };
      const token = this.jwtService.sign(payload);
      this.logger.log(`Token was created for this user with this id: ${id}`);
      return { token };
    } catch (error) {
      this.logger.error(`Error during token generation for user with this id: ${user.id}: ${error.message}`);
      throw new InternalServerErrorException("Failed to generate token");
    }
  }

  private async validateUser(userDto: LoginUserDto) {
    const user = await this.userService.getUserByEmail(userDto.email);
    if (!user) {
      this.logger.error(`User with email ${userDto.email} not found`);
      throw new UnauthorizedException({ message: "User not found" });
    }
    const passwordEquals = await bcrypt.compare(
      userDto.password,
      user.password,
    );
    if (!passwordEquals) {
      this.logger.error(`This password: ${userDto.password} invalid`);
      throw new UnauthorizedException({ message: "Invalid password" });
    }
    this.logger.log(`User with this id: ${user.id} has been successfully validated`);
    return user;
  }
}
