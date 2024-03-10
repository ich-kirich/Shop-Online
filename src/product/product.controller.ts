import { Body, Controller, Post } from "@nestjs/common";
import { ProductService } from "./product.service";

@Controller("product")
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  createFeedback(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }
}
