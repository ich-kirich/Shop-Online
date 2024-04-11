import { Body, Controller, Delete, Get, Post, UseGuards } from "@nestjs/common";
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { JwtAuthGuard } from "src/models/auth/jwt-auth.guard";
import { roles } from "src/models/auth/roles-auth.decorator";
import { RolesGuard } from "src/models/auth/roles.guard";
import { updateProductDto } from "src/types/types";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Product } from "./product.model";

@ApiTags("Products")
@Controller("product")
export class ProductController {
  constructor(private productService: ProductService) {}

  @ApiOperation({ summary: "Product Creation" })
  @ApiResponse({ status: 200, type: Product })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @roles("ADMIN")
  @Post()
  createProduct(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  @ApiOperation({ summary: "Update Product" })
  @ApiResponse({ status: 200, type: Product })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @roles("ADMIN")
  @Post("/update")
  updateProduct(@Body() dto: updateProductDto) {
    return this.productService.updateProduct(dto);
  }

  @ApiOperation({ summary: "Delete Product" })
  @ApiResponse({ status: 200 })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @roles("ADMIN")
  @Delete("/delete")
  deleteProductById(@Body() requestBody: { id: number }) {
    return this.productService.deleteProductById(requestBody.id);
  }


  @ApiOperation({ summary: "Get Product by Id" })
  @ApiResponse({ status: 200, type: Product })
  @Get()
  getProductById(@Body() requestBody: { id: number }) {
    return this.productService.getProductById(requestBody.id);
  }
}
