import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  private readonly logger = new Logger(JwtAuthGuard.name);

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      const authHeader = req.headers.authorization;
      const schema = authHeader.split(" ")[0];
      const token = authHeader.split(" ")[1];
      if (schema !== "Bearer" || !token) {
        this.logger.error(`User not authorized`);
        throw new UnauthorizedException({ message: "User not authorized" });
      }
      const user = this.jwtService.verify(token);
      req.user = user;
      return true;
    } catch (e) {
      this.logger.error(`User not authorized`);
      throw new UnauthorizedException({ message: "User not authorized" });
    }
  }
}
