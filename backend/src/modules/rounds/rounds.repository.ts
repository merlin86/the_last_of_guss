import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class RoundsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(round_id: string): Promise<Prisma.roundsGetPayload<Prisma.roundsDefaultArgs>> {
    return this.prisma.rounds.create({
      data: {
        round_id,
      },
    });
  }
}
