import { Body, Controller, Delete, Get, Post, UseGuards } from "@nestjs/common";
import { CreateFeedbackDto } from "./dto/create-feedback.dto";
import { FeedbackService } from "./feedback.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { roles } from "src/auth/roles-auth.decorator";
import { RolesGuard } from "src/auth/roles.guard";
import { updateFeedbackDto } from "src/types/types";

@Controller("feedback")
export class FeedbackController {
  constructor(private feedbackService: FeedbackService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @roles("USER")
  @Post()
  createFeedback(@Body() dto: CreateFeedbackDto) {
    return this.feedbackService.createFeedback(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @roles("USER")
  @Post("/update")
  updateFeedback(@Body() dto: updateFeedbackDto) {
    return this.feedbackService.updateFeedback(dto);
  }

  @Get("/user")
  getFeedbackByUser(@Body() requestBody: { id: number }) {
    return this.feedbackService.getFeedbackByUserId(requestBody.id);
  }

  @Get("/product")
  getFeedbackByProduct(@Body() requestBody: { id: number }) {
    return this.feedbackService.getFeedbackByProductId(requestBody.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @roles("ADMIN")
  @Delete("/delete")
  deleteFeedbackByProduct(@Body() requestBody: { id: number }) {
    return this.feedbackService.deleteFeedbackById(requestBody.id);
  }
}
