import { Body, Controller, Post } from "@nestjs/common";
import { OrderService } from "./order.service";
import { CreateOrderDto } from "./dto/create-order.dto";

@Controller("order")
export class OrderController {
    constructor(private orderService: OrderService){}

    @Post()
    createFeedback(@Body() dto: CreateOrderDto) {
        return this.orderService.create(dto)
    }
}