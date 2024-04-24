import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { checkAuthorization } from "src/libs/utils";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  private readonly logger = new Logger(JwtAuthGuard.name);

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    try {
      const user = checkAuthorization(context);
      return true;
    } catch (e) {
      this.logger.error(`User not authorized`);
      throw new UnauthorizedException({ message: "User not authorized" });
    }
  }
}
