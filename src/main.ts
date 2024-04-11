import { NestFactory } from "@nestjs/core";
import config from "config";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "./pipes/validation.pipe";

const PORT = Number(config.get("server.port")) || 5000;
const CONFIG_SWAGGER = new DocumentBuilder()
  .setTitle("Tree Shop")
  .setDescription("Online lumber retailer")
  .setVersion("1.0.0")
  .addTag("Shop")
  .build();

async function start() {
  try {
    const app = await NestFactory.create(AppModule);
    const documentSwagger = SwaggerModule.createDocument(app, CONFIG_SWAGGER);
    SwaggerModule.setup("/api/docs", app, documentSwagger);
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(PORT, () => console.log(`Server started on ${PORT}`));
  } catch (error) {
    throw new Error(error);
  }
}

start();
