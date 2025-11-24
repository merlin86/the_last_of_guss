import { ApiProperty } from '@nestjs/swagger';

export class LoginResDTO {
  @ApiProperty()
  token: string;
}
