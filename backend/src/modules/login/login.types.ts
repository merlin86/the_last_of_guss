import { users } from '@prisma/client';

export type UserData = Pick<users, 'id' | 'name' | 'role'>;
