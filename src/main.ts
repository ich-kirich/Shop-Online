import { NestFactory } from "@nestjs/core";
import config from "config";
import { AppModule } from "./app.module";


const PORT = Number(config.get("server.port")) || 5000;

async function start() {
    const app = await NestFactory.create(AppModule)
    await app.listen(PORT, () => console.log(`Server stated on ${PORT}`))
}

start();
