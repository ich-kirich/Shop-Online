import { Injectable, Logger } from "@nestjs/common";
import { User } from "./users.model";
import { InjectModel } from "@nestjs/sequelize";
import { CreateUserDto, UpdateUserDto } from "./dto/create-user.dto";
import * as bcrypt from "bcryptjs";
import { Order } from "../order/order.model";
import { ROLES } from "src/libs/constants";
import { uploadImage } from "src/libs/utils";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userRepository: typeof User) {}

  private readonly logger = new Logger(UsersService.name);

  async createUser(dto: CreateUserDto) {
    try {
      const user = await this.userRepository.create(dto);
      this.logger.log(`User created: ${user.id}`);
      return user;
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`);
      throw new Error("Failed to create user");
    }
  }

  async getAllUsers() {
    try {
      const users = await this.userRepository.findAll();
      this.logger.log(`Fetched ${users.length} users`);
      return users;
    } catch (error) {
      this.logger.error(`Error fetching all users: ${error.message}`);
      throw new Error("Failed to fetch all users");
    }
  }

  async getUserByEmail(email: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
      });
      this.logger.log(`Fetched user with this id: ${user.id}`);
      return user;
    } catch (error) {
      this.logger.error(
        `Error fetching user by email ${email}: ${error.message}`,
      );
      throw new Error(`Failed to fetch user by email ${email}`);
    }
  }

  async getUserById(id: number, role: string) {
    let user: User;
    if (role) {
      user = await this.userRepository.findByPk(id);
    } else {
      user = await this.userRepository.findByPk(id, {
        attributes: ["id", "name", "email", "image", "role"],
      });
    }
    if (!user) {
      this.logger.error(`Error fetching user with this id: ${id}`);
      throw new Error("User not found");
    }
    this.logger.log(`Fetched user with this id: ${user.id}`);
    return user;
  }

  async updateUser(userDto: UpdateUserDto, id: number, image?: Express.Multer.File) {
    const { password, name } = userDto;
    const user = await User.findByPk(id);
    if (!user) {
      this.logger.error(`Error updating user with this id: ${id}`);
      throw new Error("User not found");
    }
    if (password !== undefined) {
      const hashPassword = await bcrypt.hash(password, 5);
      user.password = hashPassword;
    }
    if (name !== undefined) {
      user.name = name;
    }
    if (image !== undefined) {
      const loadImage = await uploadImage(image);
      await User.update({ image: loadImage }, { where: { id: user.id } });
    }
    await user.save();
    this.logger.log(`User with this id: ${user.id} was successfully updated`);
    return user;
  }

  async deleteUserById(id: number, userId: number, role: string) {
    if (id === userId || role === ROLES.ADMIN) {
      const user = await this.userRepository.findByPk(id);
      if (!user) {
        this.logger.error(`Error deleting user with this id: ${id}`);
        throw new Error("User not found");
      }
      await Order.destroy({
        where: { userId: id },
      });
      const deletedUser = await this.userRepository.destroy({
        where: { id },
      });
      this.logger.log(`User with this id: ${id} was successfully deleted`);
      return { success: true };
    }
    this.logger.error(`User with this id: ${id} has no rights to delete User`);
    throw new Error("User has no rights to delete User");
  }
}
