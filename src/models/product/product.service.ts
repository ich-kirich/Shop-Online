import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Product } from "./product.model";
import { CreateProductDto, UpdateProductDto } from "./dto/create-product.dto";
import { Feedback } from "../feedback/feedback.model";

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product) private productRepository: typeof Product,
    @InjectModel(Feedback) private feedbackRepository: typeof Feedback,
  ) {}

  private readonly logger = new Logger(ProductService.name);

  async create(dto: CreateProductDto) {
    try {
      const product = await this.productRepository.create(dto);
      this.logger.log(`Product created: ${product.id}`);
      return product;
    } catch (error) {
      this.logger.error(`Error creating product: ${error.message}`);
      throw new Error("Failed to create product");
    }
  }

  async getProductById(id: number) {
    try {
      const product = await this.productRepository.findOne({
        where: { id },
        include: [
          {
            model: Feedback,
          },
        ],
      });
      this.logger.log(`Product with this id: ${product.id} was received`);
      return product;
    } catch (error) {
      this.logger.error(`Error fetcthing product by ID: ${error.message}`);
      throw new Error("Failed to fetch product by ID");
    }
  }

  async deleteProductById(id: number) {
    await this.feedbackRepository.destroy({
      where: { productId: id },
    });

    const deletedProduct = await this.productRepository.destroy({
      where: { id },
    });

    if (deletedProduct === 0) {
      this.logger.error(`Error deleting product with this id: ${id}`);
      throw new Error("Product not found");
    }

    this.logger.log(`Product with this id: ${id} was successfully deleted`);
    return { success: true };
  }

  async updateProduct(productDto: UpdateProductDto) {
    const { id, name, type, size, price, quantity, image, description } =
      productDto;
    const product = await Product.findByPk(id);
    if (!product) {
      this.logger.error(`Error updating product with this id: ${id}`);
      throw new Error("Product not found");
    }

    product.name = name !== undefined ? name : product.name;
    product.type = type !== undefined ? type : product.type;
    product.size = size !== undefined ? size : product.size;
    product.price = price !== undefined ? price : product.price;
    product.quantity = quantity !== undefined ? quantity : product.quantity;
    product.image = image !== undefined ? image : product.image;
    product.description =
      description !== undefined ? description : product.description;

    await product.save();
    this.logger.log(
      `Product with this id: ${product.id} was successfully updated`,
    );
    return product;
  }
}
