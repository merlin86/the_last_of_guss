import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { LoginRepository } from './login.repository';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule],
  providers: [LoginService, LoginRepository],
  controllers: [LoginController],
})
export class LoginModule {}
