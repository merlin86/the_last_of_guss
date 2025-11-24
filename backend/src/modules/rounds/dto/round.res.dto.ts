import { ApiProperty } from '@nestjs/swagger';

export enum RoundStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  COOLDOWN = 'cooldown',
}

export class RoundResDTO {
  @ApiProperty()
  round_id: string;

  @ApiProperty()
  round_start: Date;

  @ApiProperty()
  round_end: Date;

  @ApiProperty({ enum: RoundStatus, example: 'active | completed | cooldown' })
  status: RoundStatus;
}
