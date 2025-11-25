import * as _ from 'lodash';
import * as bcrypt from 'bcrypt';
import { Inject, Injectable } from '@nestjs/common';
import { LoginReqDTO } from './dto/login.req.dto';
import { LoginResDTO } from './dto/login.res.dto';
import loginConfig from '@configs/login.config';
import { type ConfigType } from '@nestjs/config';
import { LoginRepository } from './login.repository';
import { InvalidPasswordError } from './login.errors';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LoginService {
  constructor(
    @Inject(loginConfig.KEY) private readonly config: ConfigType<typeof loginConfig>,
    private readonly jwt: JwtService,
    private readonly repository: LoginRepository,
  ) {}

  async login(data: LoginReqDTO): Promise<LoginResDTO> {
    const passwd_hash = await bcrypt.hash(data.password, this.config.user_password_salt_rounds);
    const user = await this.repository.getUser(data.login, passwd_hash);
    if (!(await bcrypt.compare(data.password, user.password))) {
      throw new InvalidPasswordError();
    }

    const token = await this.jwt.signAsync(_.pick(user, ['id', 'name', 'role']), {
      secret: this.config.jwt_secret,
      expiresIn: this.config.jwt_expiration_min * 60,
    });
    return { token };
  }
}
