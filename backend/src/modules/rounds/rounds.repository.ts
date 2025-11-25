/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class RoundsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(round_id: string) {
    return this.prisma.rounds.create({
      data: {
        round_id,
      },
    });
  }

  getRound(round_id: string) {
    return this.prisma.rounds.findUnique({ where: { round_id } });
  }

  getRoundWithPlayers(round_id: string) {
    return this.prisma.rounds.findUnique({
      where: { round_id },
      include: {
        players: {
          include: { user: true },
          orderBy: { score: Prisma.SortOrder.desc },
        },
      },
    });
  }

  getRoundsList() {
    return this.prisma.rounds.findMany({ orderBy: { created_at: Prisma.SortOrder.desc } });
  }

  async countTap(round_id: number, user_id: number): Promise<number> {
    const { count, need_retry } = await this.prisma.$transaction(
      async (trx) => {
        try {
          const cur_data = await trx.round_players.findUnique({
            where: {
              user_id_round_id: { user_id, round_id },
            },
          });

          if (!cur_data) {
            const new_data = await trx.round_players.create({
              data: {
                user_id,
                round_id,
                score: 1,
              },
            });
            return { count: new_data.score, need_retry: false };
          }

          const num_taps = this.calculateTapsFromScore(cur_data.score);
          const new_data = await trx.round_players.update({
            where: {
              user_id_round_id: { user_id, round_id },
            },
            data: {
              score: (num_taps + 1) % 11 === 0 ? cur_data.score + 10 : cur_data.score + 1,
            },
          });

          return { count: new_data.score, need_retry: false };
        } catch (error) {
          if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // Serialization failure, need to retry
            if (error.code === 'P2034') {
              return { count: 0, need_retry: true };
            }
          }
          throw error;
        }
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });

      if (need_retry) {
        return this.countTap(round_id, user_id);
      }

      return count;
  }

  private calculateTapsFromScore(score: number): number {
    if (score === 0) return 0;
    
    // each 11 taps = 10 + 10 = 20 points
    const num_of_eleveens = Math.floor(score / 20);
    const remainder = score - num_of_eleveens * 20;
    return num_of_eleveens * 11 + remainder;
  }
}
