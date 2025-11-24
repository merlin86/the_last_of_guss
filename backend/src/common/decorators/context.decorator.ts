import { AuthenticatedRequest, ContextData } from '@common/types';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Context = createParamDecorator((data: unknown, ctx: ExecutionContext): ContextData | undefined => {
  const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();

  return request.context;
});
