import { InjectModel } from "@nestjs/sequelize";
import { CreateFeedbackDto } from "./dto/create-feedback.dto";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Feedback } from "./feedback.model";
import { updateFeedbackDto } from "src/types/types";
import { Product } from "../product/product.model";
import { User } from "../users/users.model";

@Injectable()
export class FeedbackService {
  constructor(
    @InjectModel(Feedback) private feedbackRepository: typeof Feedback,
  ) {}

  async createFeedback(id: number, dto: CreateFeedbackDto) {
    const feedback = await this.feedbackRepository.create({
      ...dto,
      userId: id,
    });
    return feedback;
  }

  async getFeedbackByUserId(id: number) {
    const feedback = await this.feedbackRepository.findAll({
      where: { userId: id },
      include: [
        {
          model: User,
          attributes: ["id", "name", "image"],
        },
        {
          model: Product,
          attributes: ["id", "name", "image"],
        },
      ],
    });
    return feedback;
  }

  async getFeedbackByProductId(id: number) {
    const feedback = await this.feedbackRepository.findAll({
      where: { productId: id },
      include: [
        {
          model: User,
          attributes: ["id", "name", "image"],
        },
      ],
    });
    return feedback;
  }

  async updateFeedback(id: number, feedbackDto: updateFeedbackDto) {
    const { feedbackId, newGrade, newText } = feedbackDto;
    const feedback = await Feedback.findByPk(feedbackId);
    if (id !== feedback.userId) {
      throw new Error(
        "The user does not have permissions to modify this comment.",
      );
    }
    if (!feedback) {
      throw new Error("Feedback not found");
    }
    if (newGrade !== undefined) {
      feedback.grade = newGrade;
    }
    if (newText !== undefined) {
      feedback.text = newText;
    }

    await feedback.save();
    return feedback;
  }

  async deleteFeedbackById(id: number, role: string) {
    if (role === "USER") {
      const feedback = await this.feedbackRepository.findOne({
        where: { id },
      });

      if (!feedback) {
        throw new NotFoundException(`Feedback with this id ${id} not found`);
      }
    }
    const deletedFeedback = await this.feedbackRepository.destroy({
      where: { id },
    });

    if (deletedFeedback === 0) {
      throw new Error("Feedback not found");
    }

    return { success: true };
  }
}
