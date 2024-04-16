import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "./pipes/validation.pipe";
import { PATH_TO_SWAGGER, SERVER } from "./libs/constants";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { Logger } from "@nestjs/common";
import config from "config";

async function start() {
  const logger = new Logger("App");
  const PORT = Number(config.get(SERVER.PORT)) || 5000;
  const CONFIG_SWAGGER = new DocumentBuilder()
    .setTitle("Tree Shop")
    .setDescription("Online lumber retailer")
    .setVersion("1.0.0")
    .addTag("Shop")
    .build();

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
