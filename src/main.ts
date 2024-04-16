import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "./pipes/validation.pipe";
import { CONFIG_SWAGGER, PATH_TO_SWAGGER } from "./libs/constants";
import { SwaggerModule } from "@nestjs/swagger";
import { Logger } from "@nestjs/common";
import config from "config";

async function start() {
  const logger = new Logger("App");
  const PORT = Number(config.get("server.port")) || 5000;
  try {
    const app = await NestFactory.create(AppModule);
    const documentSwagger = SwaggerModule.createDocument(app, CONFIG_SWAGGER);
    SwaggerModule.setup(PATH_TO_SWAGGER, app, documentSwagger);
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(PORT, () => logger.log(`Server started on port ${PORT}`));
  } catch (error) {
    logger.error(`Error starting the server: ${error}`);
    throw new Error(error);
  }
}

start();
