import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LoginReqDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255, { message: 'Поле login не может содержать строку длиннее 255 символов' })
  login: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255, { message: 'Поле password не может содержать строку длиннее 255 символов' })
  password: string;
}
