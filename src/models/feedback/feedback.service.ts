import { InjectModel } from "@nestjs/sequelize";
import { CreateFeedbackDto, UpdateFeedbackDto } from "./dto/create-feedback.dto";
import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { Feedback } from "./feedback.model";
import { Product } from "../product/product.model";
import { User } from "../users/users.model";
import { ROLES } from "src/libs/constants";

@Injectable()
export class FeedbackService {
  constructor(
    @InjectModel(Feedback) private feedbackRepository: typeof Feedback,
  ) {}

  async createFeedback(id: number, dto: CreateFeedbackDto) {
    try {
      const feedback = await this.feedbackRepository.create({
        ...dto,
        userId: id,
      });
      return feedback;
    } catch (error) {
      console.error("Error while creating feedback:", error);
      throw new InternalServerErrorException({
        message: "Failed to create feedback",
      });
    }
  }

  async getFeedbackByUserId(id: number) {
    try {
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
    } catch (error) {
      console.error("Error while fetching feedback:", error);
      throw new InternalServerErrorException({
        message: "Failed to fetch feedback",
      });
    }
  }

  async getFeedbackByProductId(id: number) {
    try {
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
    } catch (error) {
      console.error("Error while fetching feedback by product ID:", error);
      throw new InternalServerErrorException({
        message: "Failed to fetch feedback by product ID",
      });
    }
  }

  async updateFeedback(id: number, feedbackDto: UpdateFeedbackDto) {
    const { feedbackId, newGrade, newText } = feedbackDto;
    const feedback = await Feedback.findByPk(feedbackId);
    if (!feedback) {
      throw new NotFoundException("Feedback not found");
    }
    if (id !== feedback.userId) {
      throw new ForbiddenException(
        "The user does not have permissions to modify this comment.",
      );
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
    if (role === ROLES.USER) {
      const feedback = await this.feedbackRepository.findOne({
        where: { id },
      });
      if (!feedback) {
        throw new NotFoundException(`Feedback with id ${id} not found`);
      }
    }
    const deletedFeedback = await this.feedbackRepository.destroy({
      where: { id },
    });

    if (deletedFeedback === 0) {
      throw new NotFoundException(`Feedback with id ${id} not found`);
    }

    return { success: true };
  }
}
