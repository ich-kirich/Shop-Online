import { ExecutionContext, UnauthorizedException } from "@nestjs/common";

export function checkAuthorization(context: ExecutionContext) {
  const req = context.switchToHttp().getRequest();
  const authHeader = req.headers.authorization;
  const [schema, token] = authHeader.split(" ");
  if (schema !== "Bearer" || !token) {
    this.logger.error(`User not authorized`);
    throw new UnauthorizedException({ message: "User not authorized" });
  }
  const user = this.jwtService.verify(token);
  req.user = user;
  return user;
}
