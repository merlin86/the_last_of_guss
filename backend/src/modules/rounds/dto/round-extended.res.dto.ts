import { ApiPropertyOptional } from '@nestjs/swagger';
import { RoundResDTO } from './round.res.dto';

export class RoundExtendedResDTO extends RoundResDTO {
  @ApiPropertyOptional()
  total_score?: number;

  @ApiPropertyOptional()
  winner_name?: string;

  @ApiPropertyOptional()
  winner_score?: number;

  @ApiPropertyOptional()
  my_score?: number;
}
