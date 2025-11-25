import { Inject, Injectable } from '@nestjs/common';
import { uuidv7 } from 'uuidv7';
import { RoundsRepository } from './rounds.repository';
import { Prisma } from '@prisma/client';
import { RoundResDTO, RoundStatus } from './dto/round.res.dto';
import roundsConfig from '@configs/rounds.config';
import { type ConfigType } from '@nestjs/config';
import { DateTime } from 'luxon';
import { TapResDTO } from './dto/tap.res.dto';
import { RoundFinishedError, RoundNotFoundError, RoundNotStartedError } from './rounds.errors';

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

  async tap(round_id: string, user_id: number): Promise<TapResDTO> {
    const round_data = await this.repository.getRound(round_id);
    if (!round_data) {
      throw new RoundNotFoundError(round_id);
    }

    // Checking if the round is active
    const { round_start, round_end } = this.getRoundStartAndEnd(round_data);
    const now = DateTime.utc();

    if (now < round_start) {
      throw new RoundNotStartedError();
    }
    if (now > round_end) {
      throw new RoundFinishedError();
    }

    // Applying the tap
    const score = await this.repository.countTap(round_data.id, user_id);
    return { score };
  }

  async getRoundsList(): Promise<RoundResDTO[]> {
    const rounds_data = await this.repository.getRoundsList();
    return rounds_data.map((round) => this.getRoundInfo(round));
  }

  private getRoundStartAndEnd(round: Prisma.roundsGetPayload<Prisma.roundsDefaultArgs>) {
    const round_start = DateTime.fromJSDate(round.created_at).plus({ seconds: this.config.cooldown_duration });
    const round_end = round_start.plus({ seconds: this.config.round_duration });
    return { round_start, round_end };
  }

  private getRoundInfo(round: Prisma.roundsGetPayload<Prisma.roundsDefaultArgs>): RoundResDTO {
    const { round_start, round_end } = this.getRoundStartAndEnd(round);
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
