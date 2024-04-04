import { Body, Controller, Post } from "@nestjs/common";
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dto/create-product.dto";

@Controller("product")
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  createProduct(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }
}
