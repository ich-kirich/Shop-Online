import { Injectable } from "@nestjs/common";
import { User } from "./users.model";
import { InjectModel } from "@nestjs/sequelize";
import { CreateUserDto } from "./dto/create-user.dto";
import { updateUserDto } from "src/types/types";
import * as bcrypt from "bcryptjs";
import { OrderService } from "src/order/order.service";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userRepository: typeof User) {}

  async createUser(dto: CreateUserDto) {
    const user = await this.userRepository.create(dto);
    return user;
  }

  async getAllUsers() {
    const users = await this.userRepository.findAll();
    return users;
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    return user;
  }

  async getUserByIdAdmin(id: number) {
    const user = await this.userRepository.findByPk(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async getUserById(id: number) {
    const user = await this.userRepository.findByPk(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async getUserByIdOthers(id: number) {
    const user = await this.userRepository.findByPk(id, {
      attributes: ["id", "name", "email", "image", "role"],
    });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async updateUser(userDto: updateUserDto, id: number, role: string) {
    const { password, userId, name, image } = userDto;
    if (userId === id || role === "ADMIN") {
      const user = await User.findByPk(userId);
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
    throw new Error("User has no rights to change the data");
  }

  // Добавить удаление всех заказов связанных с пользователем
  async deleteUserById(deleteId: number, userId: number, role: string) {
    if (deleteId === userId || role === "ADMIN") {
      const deletedUser = await this.userRepository.destroy({
        where: { id: deleteId },
        cascade: true,
      });

      if (deletedUser === 0) {
        throw new Error("User not found");
      }

      return { success: true };
    }
    throw new Error("User has no rights to delete User");
  }
}
