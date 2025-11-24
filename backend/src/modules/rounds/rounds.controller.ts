import { ApiTags } from '@nestjs/swagger';
import { Controller, Post, UseInterceptors } from '@nestjs/common';
import { UniversalResponseInterceptor } from '@common/interceptors/universal-response.interceptor';
import { UniversalResponse } from '@common/decorators/universal-response.decorator';
import { JwtAuth } from '@modules/login/auth.guard';
import { Context } from '@common/decorators/context.decorator';
import { type ContextData } from '@common/types';

@Controller({
  path: 'api/rounds',
  version: '1',
})
@ApiTags('rounds')
@UseInterceptors(UniversalResponseInterceptor)
export class RoundsController {
  @Post()
  @UniversalResponse()
  @JwtAuth()
  create(@Context() context?: ContextData) {
    console.log(context?.name);
    console.log(context?.role);
  }
}
