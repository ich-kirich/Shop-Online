import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "./pipes/validation.pipe";
import { CONFIG_SWAGGER, PATH_TO_SWAGGER, PORT } from "./libs/constants";
import { SwaggerModule } from "@nestjs/swagger";

async function start() {
  try {
    const app = await NestFactory.create(AppModule);
    const documentSwagger = SwaggerModule.createDocument(app, CONFIG_SWAGGER);
    SwaggerModule.setup(PATH_TO_SWAGGER, app, documentSwagger);
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(PORT, () => console.log(`Server started on ${PORT}`));
  } catch (error) {
    throw new Error(error);
  }
}

start();
