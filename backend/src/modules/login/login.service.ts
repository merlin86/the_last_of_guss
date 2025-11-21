import { Injectable } from '@nestjs/common';
import { LoginReqDTO } from './dto/login.req.dto';
import { LoginResDTO } from './dto/login.res.dto';

@Injectable()
export class LoginService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  login(data: LoginReqDTO): Promise<LoginResDTO> {
    return Promise.resolve({ token: 'token_str' });
  }
}
