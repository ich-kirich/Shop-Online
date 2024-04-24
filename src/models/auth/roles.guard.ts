import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { ROLES_KEY } from "./roles-auth.decorator";
import { checkAuthorization } from "src/libs/utils";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  private readonly logger = new Logger(RolesGuard.name);

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
      if (!requiredRoles) {
        return true;
      }
      const user = checkAuthorization(context);
      return requiredRoles.includes(user.role);
    } catch (e) {
      this.logger.error(`User not authorized`);
      throw new UnauthorizedException({ message: "User not authorized" });
    }
  }
}
