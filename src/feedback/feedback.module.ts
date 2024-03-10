import { Module, forwardRef } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/users.model';
import { Feedback } from './feedback.model';

@Module({
  providers: [FeedbackService],
  controllers: [FeedbackController],
  imports: [SequelizeModule.forFeature([User, Feedback])],
})
export class FeedbackModule {}
