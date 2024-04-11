import { Body, Controller, Delete, Get, Post, Req, UseGuards } from "@nestjs/common";
import { OrderService } from "./order.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { JwtAuthGuard } from "src/models/auth/jwt-auth.guard";
import { RolesGuard } from "src/models/auth/roles.guard";
import { roles } from "src/models/auth/roles-auth.decorator";
import { JwtService } from "@nestjs/jwt";
import { updateOrderDto } from "src/types/types";
import { Order } from "./order.model";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("Orders")
@Controller("order")
export class OrderController {
  constructor(private orderService: OrderService, private jwtService: JwtService) {}

  @ApiOperation({ summary: "Order Creation" })
  @ApiResponse({ status: 200, type: Order })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @roles("USER")
  @Post()
  createOrder(@Body() dto: CreateOrderDto) {
    return this.orderService.create(dto);
  }

  @ApiOperation({ summary: "Get user orders" })
  @ApiResponse({ status: 200, type: [Order] })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @roles("USER", "ADMIN")
  @Get()
  getUserOrders(@Req() req, @Body() requestBody: { id?: number }) {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = this.jwtService.decode(token);
    let userId = Number(decodedToken.id);
    if (decodedToken.role === "ADMIN") {
      userId = requestBody.id;
    }
    return this.orderService.getOrdersByUserId(userId);
  }

  @ApiOperation({ summary: "Update order" })
  @ApiResponse({ status: 200, type: Order })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @roles("USER", "ADMIN")
  @Post("/update")
  updateOrder(@Req() req, @Body() dto: updateOrderDto) {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = this.jwtService.decode(token);
    let userId = Number(decodedToken.id);
    if (decodedToken.role === "ADMIN") {
      userId = Number(dto.userId);
    }
    return this.orderService.updateOrder(userId, dto);
  }

  @ApiOperation({ summary: "Delete order" })
  @ApiResponse({ status: 200 })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @roles("ADMIN", "USER")
  @Delete("/delete")
  deleteOrder(@Req() req, @Body() requestBody: { number: number }) {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = this.jwtService.decode(token);
    return this.orderService.deleteOrderById(requestBody.number, decodedToken.role, decodedToken.id);
  }
}
