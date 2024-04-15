import FormData from "form-data";
import config from "config";
import { v4 as uuidv4 } from "uuid";
import mime from "mime-types";
import axios from "axios";
import { Logger } from "@nestjs/common";

async function uploadImageToApi(image: Express.Multer.File, name: string) {
  const logger = new Logger("uploadImageToApi");
  try {
    const formData = new FormData();
    formData.append("image", image.buffer, { filename: name });
    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${config.get("imageStorage.apiKey")}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    const imageUrl = response.data.data.url;
    logger.log("Image was successfully uploaded to the api", imageUrl);
    return imageUrl;
  } catch (e) {
    logger.error("Error during uploading a image to the api", e);
    throw new Error(e);
  }
}

export async function validateFile(image: Express.Multer.File) {
  const logger = new Logger("validateFile");
  const fileExtension = mime.extension(image.mimetype);
  if (!fileExtension || !image.mimetype.startsWith("image/")) {
    logger.error("File entered is not an image", image);
    throw new Error("File entered is not an image");
  }
  logger.log("Entered file was validated successfully");
  return fileExtension;
}

export async function uploadImage(image: Express.Multer.File) {
  const checkFile = await validateFile(image);
  const fileName = `${uuidv4()}.${checkFile as string}`;
  const loadImage = await uploadImageToApi(image, fileName);
  return loadImage;
}
