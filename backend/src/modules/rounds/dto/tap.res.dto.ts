import { ApiProperty } from '@nestjs/swagger';

export class TapResDTO {
  @ApiProperty()
  score: number;
}
