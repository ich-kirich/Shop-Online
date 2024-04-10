import { Injectable } from "@nestjs/common";
import { User } from "./users.model";
import { InjectModel } from "@nestjs/sequelize";
import { CreateUserDto } from "./dto/create-user.dto";
import { updateUserDto } from "src/types/types";
import * as bcrypt from "bcryptjs";
import { OrderService } from "src/order/order.service";
import { Order } from "src/order/order.model";

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

  async getUserById(id: number, role: string) {
    let user;
    if(role) {
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
    if (id === userId || role === "ADMIN") {
      const user = await this.userRepository.findByPk(id);
      if (!user) {
        throw new Error("User not found");
      }
      await Order.destroy({
        where: { userId: id }
      });
      const deletedUser = await this.userRepository.destroy({
        where: { id }
      });

      return { success: true };
    }
    throw new Error("User has no rights to delete User");
  }
}
