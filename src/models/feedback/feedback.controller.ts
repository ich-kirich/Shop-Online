import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { Request } from "express";
import { CreateFeedbackDto } from "./dto/create-feedback.dto";
import { FeedbackService } from "./feedback.service";
import { JwtAuthGuard } from "src/models/auth/jwt-auth.guard";
import { roles } from "src/models/auth/roles-auth.decorator";
import { RolesGuard } from "src/models/auth/roles.guard";
import { updateFeedbackDto } from "src/types/types";
import { JwtService } from "@nestjs/jwt";
import { Feedback } from "./feedback.model";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ROLES } from "src/libs/constants";

@ApiTags("Feedback")
@Controller("feedback")
export class FeedbackController {
  constructor(
    private feedbackService: FeedbackService,
    private jwtService: JwtService,
  ) {}

  @ApiOperation({ summary: "Feedback Creation" })
  @ApiResponse({ status: 200, type: Feedback })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @roles(ROLES.USER)
  @Post()
  createFeedback(@Req() req: Request, @Body() dto: CreateFeedbackDto) {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = this.jwtService.decode(token);
    return this.feedbackService.createFeedback(decodedToken.id, dto);
  }

  @ApiOperation({ summary: "Update Feedback" })
  @ApiResponse({ status: 200, type: Feedback })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @roles(ROLES.USER)
  @Post("/update")
  updateFeedback(@Req() req: Request, @Body() dto: updateFeedbackDto) {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = this.jwtService.decode(token);
    return this.feedbackService.updateFeedback(decodedToken.id, dto);
  }

  @ApiOperation({ summary: "Get user feedback" })
  @ApiResponse({ status: 200, type: [Feedback] })
  @Get("/user")
  getFeedbackByUser(@Body() requestBody: { id: number }) {
    return this.feedbackService.getFeedbackByUserId(requestBody.id);
  }

  @ApiOperation({ summary: "Get feedback of product" })
  @ApiResponse({ status: 200, type: [Feedback] })
  @Get("/product")
  getFeedbackByProduct(@Body() requestBody: { id: number }) {
    return this.feedbackService.getFeedbackByProductId(requestBody.id);
  }

  @ApiOperation({ summary: "Delete feedback" })
  @ApiResponse({ status: 200 })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @roles(ROLES.ADMIN, ROLES.USER)
  @Delete("/delete")
  deleteFeedback(@Req() req: Request, @Body() requestBody: { id: number }) {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = this.jwtService.decode(token);
    return this.feedbackService.deleteFeedbackById(
      requestBody.id,
      decodedToken.role,
    );
  }
}
