import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { OrderService } from "./order.service";
import { CreateOrderDto, UpdateOrderDto } from "./dto/create-order.dto";
import { JwtAuthGuard } from "src/models/auth/jwt-auth.guard";
import { RolesGuard } from "src/models/auth/roles.guard";
import { roles } from "src/models/auth/roles-auth.decorator";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { Order } from "./order.model";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ROLES } from "src/libs/constants";

@ApiTags("Orders")
@Controller("order")
export class OrderController {
  constructor(
    private orderService: OrderService,
    private jwtService: JwtService,
  ) {}

  @ApiOperation({ summary: "Order Creation" })
  @ApiResponse({ status: 200, type: Order })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @roles(ROLES.USER)
  @Post()
  createOrder(@Body() dto: CreateOrderDto) {
    return this.orderService.create(dto);
  }

  @ApiOperation({ summary: "Get user orders" })
  @ApiResponse({ status: 200, type: [Order] })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @roles(ROLES.ADMIN, ROLES.USER)
  @Get()
  getUserOrders(@Req() req: Request, @Body() requestBody: { id?: number }) {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = this.jwtService.decode(token);
    let userId = Number(decodedToken.id);
    if (decodedToken.role === ROLES.ADMIN) {
      userId = requestBody.id;
    }
    return this.orderService.getOrdersByUserId(userId);
  }

  @ApiOperation({ summary: "Update order" })
  @ApiResponse({ status: 200, type: Order })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @roles(ROLES.ADMIN, ROLES.USER)
  @Post("/update")
  updateOrder(@Req() req: Request, @Body() dto: UpdateOrderDto) {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = this.jwtService.decode(token);
    let userId = Number(decodedToken.id);
    if (decodedToken.role === ROLES.ADMIN) {
      userId = Number(dto.userId);
    }
    return this.orderService.updateOrder(userId, dto);
  }

  @ApiOperation({ summary: "Delete order" })
  @ApiResponse({ status: 200 })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @roles(ROLES.ADMIN, ROLES.USER)
  @Delete("/delete")
  deleteOrder(@Req() req: Request, @Body() requestBody: { number: number }) {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = this.jwtService.decode(token);
    return this.orderService.deleteOrderById(
      requestBody.number,
      decodedToken.role,
      decodedToken.id,
    );
  }
}
