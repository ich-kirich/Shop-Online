import { NestFactory } from "@nestjs/core";
import config from "config";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

const PORT = Number(config.get("server.port")) || 5000;
const CONFIG_SWAGGER = new DocumentBuilder()
  .setTitle("Tree Shop")
  .setDescription("Online lumber retailer")
  .setVersion("1.0.0")
  .addTag("Shop")
  .build();

async function start() {
  const app = await NestFactory.create(AppModule);
  const documentSwagger = SwaggerModule.createDocument(app, CONFIG_SWAGGER);
  SwaggerModule.setup("/api/docs", app, documentSwagger);
  await app.listen(PORT, () => console.log(`Server stated on ${PORT}`));
}

start();
