import { Injectable, Logger } from "@nestjs/common";
import FormData from "form-data";
import config from "config";
import { v4 as uuidv4 } from "uuid";
import mime from "mime-types";
import axios from "axios";
import { IMAGE_STORAGE } from "../constants";

@Injectable()
export class ImageService {
  private readonly logger = new Logger(ImageService.name);

  async uploadImageToApi(image: Express.Multer.File, name: string) {
    try {
      const formData = new FormData();
      formData.append("image", image.buffer, { filename: name });
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${config.get(IMAGE_STORAGE.API_KEY)}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      const imageUrl = response.data.data.url;
      this.logger.log("Image was successfully uploaded to the API", imageUrl);
      return imageUrl;
    } catch (error) {
      this.logger.error("Error during uploading an image to the API", error);
      throw new Error(error);
    }
  }

  async validateFile(image: Express.Multer.File) {
    const fileExtension = mime.extension(image.mimetype);
    if (!fileExtension || !image.mimetype.startsWith("image/")) {
      this.logger.error("File entered is not an image", image);
      throw new Error("File entered is not an image");
    }
    this.logger.log("Entered file was validated successfully");
    return fileExtension;
  }

  async uploadImage(image: Express.Multer.File) {
    const checkFile = await this.validateFile(image);
    const fileName = `${uuidv4()}.${checkFile as string}`;
    const loadImage = await this.uploadImageToApi(image, fileName);
    return loadImage;
  }
}
