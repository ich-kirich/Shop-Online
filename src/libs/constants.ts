import { DocumentBuilder } from "@nestjs/swagger";
import config from "config";

export const PATH_TO_SWAGGER = "/api/docs";
export const PORT = Number(config.get("server.port")) || 5000;
export const CONFIG_SWAGGER = new DocumentBuilder()
  .setTitle("Tree Shop")
  .setDescription("Online lumber retailer")
  .setVersion("1.0.0")
  .addTag("Shop")
  .build();

export const UNKNOWN = "Unknown";

export const SPARE_SECRET_KEY = "SPARE_SECRET_KEY";

export enum DEFAULT_IMAGE {
  USER_IMAGE = "https://i.ibb.co/1XsL5vV/2024-04-15-122726464.png",
  PRODUCT_IMAGE = "https://i.ibb.co/Lnbhjc6/default-product.webp",
}

export enum DB {
  DIALECT = "db.dialect",
  HOST = "db.host",
  PORT = "db.port",
  USERNAME = "db.username",
  PASSWORD = "db.password",
  DATABASE = "db.database",
}

export enum ROLES {
  ADMIN = "ADMIN",
  USER = "USER",
}

export enum ORDER_STATUSES {
  AWAITING_PROCESSING = "Awaiting processing by a specialist",
  PROCESSED_BY_SPECIALIST = "Handling by a specialist",
  PENDING_PAYMENT = "Pending payment",
  DELIVERY_PROCESS = "In the delivery process",
  DELIVERED = "DELIVERED",
}
