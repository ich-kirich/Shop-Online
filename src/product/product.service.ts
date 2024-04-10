import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Product } from "./product.model";
import { CreateProductDto } from "./dto/create-product.dto";
import { Feedback } from "src/feedback/feedback.model";
import { updateProductDto } from "src/types/types";

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product) private productRepository: typeof Product,
    @InjectModel(Feedback) private feedbackRepository: typeof Feedback,
  ) {}

  async create(dto: CreateProductDto) {
    const product = await this.productRepository.create(dto);
    return product;
  }

  async getProductById(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      include: [
        {
          model: Feedback,
        },
      ],
    });
    return product;
  }

  async deleteProductById(id: number) {
    await this.feedbackRepository.destroy({
      where: { productId: id },
    });

    const deletedProduct = await this.productRepository.destroy({
      where: { id },
    });

    if (deletedProduct === 0) {
      throw new Error("Product not found");
    }

    return { success: true };
  }

  async updateProduct(productDto: updateProductDto) {
    const { id, name, type, size, price, quantity, image, description } = productDto;
    const product = await Product.findByPk(id);
    if (!product) {
      throw new Error(
        "Product not found",
      );
    }
    if (name !== undefined) {
      product.name = name;
    }
    if (type !== undefined) {
      product.type = type;
    }
    if (size !== undefined) {
      product.size = size;
    }
    if (price !== undefined) {
      product.price = price;
    }
    if (quantity !== undefined) {
      product.quantity = quantity;
    }
    if (image !== undefined) {
      product.image = image;
    }
    if (description !== undefined) {
      product.description = description;
    }

    await product.save();
    return product;
  }
}
