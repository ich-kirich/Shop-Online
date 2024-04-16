import { InjectModel } from "@nestjs/sequelize";
import {
  CreateFeedbackDto,
  UpdateFeedbackDto,
} from "./dto/create-feedback.dto";
import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
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

  private readonly logger = new Logger(FeedbackService.name);

  async createFeedback(id: number, dto: CreateFeedbackDto) {
    try {
      const feedback = await this.feedbackRepository.create({
        ...dto,
        userId: id,
      });
      this.logger.log(`Feedback created: ${feedback.id}`);
      return feedback;
    } catch (error) {
      this.logger.error(`Error creating feedback: ${error.message}`);
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
      this.logger.log(`Fetched ${feedback.length} of user with this id: ${id}`);
      return feedback;
    } catch (error) {
      this.logger.error(
        `Error fetching feedback of user with this id: ${id}: ${error.message}`,
      );
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
      this.logger.log(
        `Fetched ${feedback.length} of product with this id: ${id}`,
      );
      return feedback;
    } catch (error) {
      this.logger.error(
        `Error fetching feedback of product with this id: ${id}: ${error.message}`,
      );
      throw new InternalServerErrorException({
        message: "Failed to fetch feedback by product ID",
      });
    }
  }

  async updateFeedback(id: number, feedbackDto: UpdateFeedbackDto) {
    const { feedbackId, newGrade, newText } = feedbackDto;
    const feedback = await Feedback.findByPk(feedbackId);
    if (!feedback) {
      this.logger.error(`Feedback with id ${id} not found`);
      throw new NotFoundException("Feedback not found");
    }
    if (id !== feedback.userId) {
      this.logger.error(
        `The user with this id: ${id}, does not have permissions to modify this comment`,
      );
      throw new ForbiddenException(
        "The user does not have permissions to modify this comment.",
      );
    }
    feedback.grade = newGrade !== undefined ? newGrade : feedback.grade;
    feedback.text = newText !== undefined ? newText : feedback.text;
    await feedback.save();
    this.logger.log(
      `Feedback with this id: ${feedback.id} was successfully updated`,
    );
    return feedback;
  }

  async deleteFeedbackById(id: number, role: string) {
    if (role === ROLES.USER) {
      const feedback = await this.feedbackRepository.findOne({
        where: { id },
      });
      if (!feedback) {
        this.logger.error(`Feedback with id ${id} not found`);
        throw new NotFoundException(`Feedback with id ${id} not found`);
      }
    }
    const deletedFeedback = await this.feedbackRepository.destroy({
      where: { id },
    });

    if (deletedFeedback === 0) {
      this.logger.error(`Feedback with id ${id} not found`);
      throw new NotFoundException(`Feedback with id ${id} not found`);
    }
    this.logger.log(`Feedback with this id: ${id} was successfully deleted`);
    return { success: true };
  }
}
