import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { transliterate } from 'transliteration';

@Injectable()
export class LoginRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getUser(login: string, passwd_hash: string) {
    return this.prisma.$transaction(async (trx) => {
      const user = await trx.users.findUnique({ where: { name: login } });
      if (!user) {
        // User not found, creating it
        const role = this.genRole(login);
        return trx.users.create({
          data: {
            name: login,
            password: passwd_hash,
            role,
          },
        });
      }
      return user;
    });
  }

  private genRole(login: string): string {
    return transliterate(login)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');
  }
}
