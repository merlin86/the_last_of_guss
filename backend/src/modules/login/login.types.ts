import { users } from '@prisma/client';

export type UserData = Pick<users, 'name' | 'role'>;
