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
import { RoundExtendedResDTO } from './dto/round-extended.res.dto';

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

  async getRound(round_id: string, user_id: number): Promise<RoundExtendedResDTO> {
    const round_data = await this.repository.getRoundWithPlayers(round_id);
    if (!round_data) {
      throw new RoundNotFoundError(round_id);
    }

    const base_info = this.getRoundInfo(round_data);

    if (base_info.status !== RoundStatus.COMPLETED) {
      return base_info;
    }

    // Computing total score
    let total_score = 0;
    let my_score = 0;
    for (const player of round_data.players) {
      if (!this.config.blacklisted_roles.includes(player.user.role)) {
        total_score += player.score;
        if (player.user_id === user_id) {
          my_score = player.score;
        }
      }
    }

    // Finding the winner, considering blacklisted roles
    let winner_idx = 0;
    while (
      winner_idx < round_data.players.length &&
      this.config.blacklisted_roles.includes(round_data.players[winner_idx].user.role)
    ) {
      winner_idx++;
    }

    let winner_name = 'no winner';
    let winner_score = 0;
    if (winner_idx < round_data.players.length) {
      winner_name = round_data.players[winner_idx].user.name;
      winner_score = round_data.players[winner_idx].score;
    }

    return {
      ...base_info,
      total_score,
      winner_name,
      winner_score,
      my_score,
    };
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
