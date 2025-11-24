import { Inject, Injectable } from '@nestjs/common';
import { uuidv7 } from 'uuidv7';
import { RoundsRepository } from './rounds.repository';
import { Prisma } from '@prisma/client';
import { RoundResDTO, RoundStatus } from './dto/round.res.dto';
import roundsConfig from '@configs/rounds.config';
import { type ConfigType } from '@nestjs/config';
import { DateTime } from 'luxon';

@Injectable()
export class RoundsService {
  constructor(
    @Inject(roundsConfig.KEY) private readonly config: ConfigType<typeof roundsConfig>,
    private readonly repository: RoundsRepository,
  ) {}

  async create(): Promise<RoundResDTO> {
    const round_id = uuidv7();
    const round_data = await this.repository.create(round_id);
    return this.getRoundInfo(round_data);
  }

  private getRoundInfo(round: Prisma.roundsGetPayload<Prisma.roundsDefaultArgs>): RoundResDTO {
    const round_start = DateTime.fromJSDate(round.created_at).plus({ seconds: this.config.cooldown_duration });
    const round_end = round_start.plus({ seconds: this.config.round_duration });
    const now = DateTime.utc();

    let status: RoundStatus;
    if (now < round_start) {
      status = RoundStatus.COOLDOWN;
    } else if (now >= round_start && now <= round_end) {
      status = RoundStatus.ACTIVE;
    } else {
      status = RoundStatus.COMPLETED;
    }

    return {
      round_id: round.round_id,
      round_start: round_start.toJSDate(),
      round_end: round_end.toJSDate(),
      status,
    };
  }
}
