import { AuthenticatedRequest } from '@common/types';
import loginConfig from '@configs/login.config';
import { applyDecorators, CanActivate, ExecutionContext, Inject, Injectable, UseGuards } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InvalidAuthHeaderError, InvalidTokenError } from './login.errors';
import { ApiSecurity } from '@nestjs/swagger';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(loginConfig.KEY) private readonly config: ConfigType<typeof loginConfig>,
    private readonly jwt: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const auth_header = request.headers.authorization;
    if (!auth_header) {
      return false;
    }

    const [bearer, token] = auth_header.split(' ');
    if (!bearer || !token) {
      throw new InvalidAuthHeaderError();
    }
    if (bearer !== 'Bearer') {
      throw new InvalidAuthHeaderError();
    }

    try {
      const { name, role } = this.jwt.verify(token, {
        secret: this.config.jwt_secret,
      });

      request.context = { name, role };
      return true;
    } catch {
      throw new InvalidTokenError();
    }
  }
}

export const JwtAuth = () => applyDecorators(UseGuards(AuthGuard), ApiSecurity('Authorization'));
