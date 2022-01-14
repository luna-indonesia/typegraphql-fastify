import { PrismaClient } from '../generated/client';

const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient;
}

export const context: Context = {
  prisma: prisma,
};
