import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { CreateFeedbackDto } from "./dto/create-feedback.dto";
import { FeedbackService } from "./feedback.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { roles } from "src/auth/roles-auth.decorator";
import { RolesGuard } from "src/auth/roles.guard";
import { updateFeedbackDto } from "src/types/types";
import { JwtService } from "@nestjs/jwt";

@Controller("feedback")
export class FeedbackController {
  constructor(
    private feedbackService: FeedbackService,
    private jwtService: JwtService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @roles("USER")
  @Post()
  createFeedback(@Req() req, @Body() dto: CreateFeedbackDto) {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = this.jwtService.decode(token);
    return this.feedbackService.createFeedback(decodedToken.id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @roles("USER")
  @Post("/update")
  updateFeedback(@Req() req, @Body() dto: updateFeedbackDto) {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = this.jwtService.decode(token);
    return this.feedbackService.updateFeedback(decodedToken.id, dto);
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
  @roles("ADMIN", "USER")
  @Delete("/delete")
  deleteFeedback(@Req() req, @Body() requestBody: { id: number }) {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = this.jwtService.decode(token);
    return this.feedbackService.deleteFeedbackById(requestBody.id, decodedToken.role);
  }
}
