import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RoleType } from "@belle-ame/shared-types";
import { ROLES_KEY } from "../decorators/roles.decorator";

interface RequestUser {
  id: string;
  roles: RoleType[];
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleType[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest<{ user?: RequestUser }>();

    if (!user || !user.roles) {
      throw new ForbiddenException({
        code: "AUTH_FORBIDDEN",
        message: "Accès refusé : privilèges insuffisants.",
      });
    }

    const hasRole = requiredRoles.some((role) => user.roles.includes(role));

    if (!hasRole) {
      throw new ForbiddenException({
        code: "AUTH_FORBIDDEN",
        message: `Accès réservé aux rôles : ${requiredRoles.join(", ")}`,
      });
    }

    return true;
  }
}
