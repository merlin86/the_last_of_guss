import { UniversalResponse } from '@common/decorators/universal-response.decorator';
import { UniversalResponseInterceptor } from '@common/interceptors/universal-response.interceptor';
import { Body, Controller, HttpCode, HttpStatus, Post, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginResDTO } from './dto/login.res.dto';
import { LoginReqDTO } from './dto/login.req.dto';
import { LoginService } from './login.service';

@Controller({
  path: 'api/login',
  version: '1',
})
@ApiTags('login')
@UseInterceptors(UniversalResponseInterceptor)
export class LoginController {
  constructor(private readonly service: LoginService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UniversalResponse(LoginResDTO)
  login(@Body() data: LoginReqDTO) {
    return this.service.login(data);
  }
}
