
import { InjectModel } from '@nestjs/sequelize';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { Injectable } from '@nestjs/common';
import { Feedback } from './feedback.model';

@Injectable()
export class FeedbackService {

    constructor(@InjectModel(Feedback) private feedbackRepository: typeof Feedback){}

    async create(dto: CreateFeedbackDto) {
        const feedback = await this.feedbackRepository.create(dto);
        return feedback;
    }

    async getFeedbackByUserId(id: number) {
        const feedback = await this.feedbackRepository.findOne({
          where: { userId: id },
          include: { all: true },
        });
        return feedback;
      }
}
