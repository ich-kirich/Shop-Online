import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { UsersModule } from './users/users.module';
import config from "config";
import { User } from "./users/users.model";
import { AuthModule } from './auth/auth.module';
import { FeedbackModule } from './feedback/feedback.module';
import { Feedback } from "./feedback/feedback.model";

@Module({
  controllers: [],
  providers: [],
  imports: [
    SequelizeModule.forRoot({
      dialect: config.get("db.dialect"),
      host: String(config.get("db.host")),
      port: Number(config.get("db.port")),
      username: String(config.get("db.username")),
      password: String(config.get("db.password")),
      database: String(config.get("db.database")),
      models: [User, Feedback],
      autoLoadModels: true,
    }),
    UsersModule,
    AuthModule,
    FeedbackModule,
  ],
})
export class AppModule {}
