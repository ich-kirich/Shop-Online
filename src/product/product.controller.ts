import { Body, Controller, Delete, Get, Post, UseGuards } from "@nestjs/common";
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { roles } from "src/auth/roles-auth.decorator";
import { RolesGuard } from "src/auth/roles.guard";
import { updateProductDto } from "src/types/types";

@Controller("product")
export class ProductController {
  constructor(private productService: ProductService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @roles("ADMIN")
  @Post()
  createProduct(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @roles("ADMIN")
  @Post("/update")
  updateFeedback(@Body() dto: updateProductDto) {
    return this.productService.updateProduct(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @roles("ADMIN")
  @Delete("/delete")
  deleteFeedbackByProduct(@Body() requestBody: { id: number }) {
    return this.productService.deleteProductById(requestBody.id);
  }

  @Get()
  getProductById(@Body() requestBody: { id: number }) {
    return this.productService.getProductById(requestBody.id);
  }
}
