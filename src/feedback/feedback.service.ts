import { InjectModel } from "@nestjs/sequelize";
import { CreateFeedbackDto } from "./dto/create-feedback.dto";
import { Injectable } from "@nestjs/common";
import { Feedback } from "./feedback.model";
import { User } from "src/users/users.model";
import { Product } from "src/product/product.model";
import { updateFeedbackDto } from "src/types/types";

@Injectable()
export class FeedbackService {
  constructor(
    @InjectModel(Feedback) private feedbackRepository: typeof Feedback,
  ) {}

  async createFeedback(dto: CreateFeedbackDto) {
    const feedback = await this.feedbackRepository.create(dto);
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

  async updateFeedback(feedbackDto: updateFeedbackDto) {
    const { feedbackId, userId, newGrade, newText } = feedbackDto;
    const feedback = await Feedback.findByPk(feedbackId);
    if (userId !== feedback.userId) {
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

  async deleteFeedbackById(id: number) {
    const deletedFeedback = await this.feedbackRepository.destroy({
      where: { id },
    });

    if (deletedFeedback === 0) {
      throw new Error("Feedback not found");
    }

    return { success: true };
  }
}
