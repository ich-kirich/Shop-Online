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
import { Order } from "./order.model";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ROLES } from "src/constants";
import { RequestWithUser } from "src/interrfaces/interrfaces";

@ApiTags("Orders")
@Controller("order")
export class OrderController {
  constructor(private orderService: OrderService) {}

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
  getUserOrders(
    @Req() req: RequestWithUser,
    @Body() requestBody: { id?: number },
  ) {
    const user = req.user;
    let userId = Number(user.id);
    if (user.role === ROLES.ADMIN) {
      userId = requestBody.id;
    }
    return this.orderService.getOrdersByUserId(userId);
  }

  @ApiOperation({ summary: "Update order" })
  @ApiResponse({ status: 200, type: Order })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @roles(ROLES.ADMIN, ROLES.USER)
  @Post("/update")
  updateOrder(@Req() req: RequestWithUser, @Body() dto: UpdateOrderDto) {
    const user = req.user;
    let userId = Number(user.id);
    if (user.role === ROLES.ADMIN) {
      userId = Number(dto.userId);
    }
    return this.orderService.updateOrder(userId, dto);
  }

  @ApiOperation({ summary: "Delete order" })
  @ApiResponse({ status: 200 })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @roles(ROLES.ADMIN, ROLES.USER)
  @Delete("/delete")
  deleteOrder(
    @Req() req: RequestWithUser,
    @Body() requestBody: { number: number },
  ) {
    const user = req.user;
    return this.orderService.deleteOrderById(
      requestBody.number,
      user.role,
      user.id,
    );
  }
}
