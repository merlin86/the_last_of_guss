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

  getRoundsList() {
    return this.prisma.rounds.findMany({ orderBy: { created_at: Prisma.SortOrder.desc } });
  }
}
