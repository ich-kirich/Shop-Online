export const PATH_TO_SWAGGER = "/api/docs";

export const UNKNOWN_VALUE = "Unknown";

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

export enum SERVER {
  PORT = "server.port",
}

export enum JWT {
  SECRET_KEY = "jwt.secretKey",
  EXPIRES_IN = "jwt.expiresIn",
}

export enum IMAGE_STORAGE {
  API_KEY = "imageStorage.apiKey",
}

export enum ROLES {
  ADMIN = "ADMIN",
  USER = "USER",
}

export enum ORDER_STATUSES {
  AWAITING_PROCESSING = "In progess",
  PROCESSED_BY_SPECIALIST = "Handling by a specialist",
  PENDING_PAYMENT = "Pending payment",
  DELIVERY_PROCESS = "In the delivery process",
  DELIVERED = "DELIVERED",
}
