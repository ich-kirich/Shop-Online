import { Injectable } from "@nestjs/common";
import { User } from "./users.model";
import { InjectModel } from "@nestjs/sequelize";
import { CreateUserDto } from "./dto/create-user.dto";
import { updateUserDto } from "src/types/types";
import * as bcrypt from "bcryptjs";
import { Order } from "../order/order.model";
import { ROLES } from "src/libs/constants";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userRepository: typeof User) {}

  async createUser(dto: CreateUserDto) {
    try {
      const user = await this.userRepository.create(dto);
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Failed to create user");
    }
  }

  async getAllUsers() {
    try {
      const users = await this.userRepository.findAll();
      return users;
    } catch (error) {
      console.error("Error fetching all users:", error);
      throw new Error("Failed to fetch all users");
    }
  }

  async getUserByEmail(email: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
      });
      return user;
    } catch (error) {
      console.error(`Error fetching user by email ${email}:`, error);
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
      throw new Error("User not found");
    }
    return user;
  }

  async updateUser(userDto: updateUserDto, id: number) {
    const { password, name, image } = userDto;
    const user = await User.findByPk(id);
    if (!user) {
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
      user.image = image;
    }
    await user.save();
    return user;
  }

  async deleteUserById(id: number, userId: number, role: string) {
    if (id === userId || role === ROLES.ADMIN) {
      const user = await this.userRepository.findByPk(id);
      if (!user) {
        throw new Error("User not found");
      }
      await Order.destroy({
        where: { userId: id },
      });
      const deletedUser = await this.userRepository.destroy({
        where: { id },
      });

      return { success: true };
    }
    throw new Error("User has no rights to delete User");
  }
}
