import type { INestApplication } from '@nestjs/common';
import type { PrismaService } from '../../src/prisma/prisma.service';

let app: INestApplication;
let prisma: PrismaService;

export function setE2eContext(
  application: INestApplication,
  prismaService: PrismaService,
): void {
  app = application;
  prisma = prismaService;
}

export function getE2eApp(): INestApplication {
  return app;
}

export function getE2ePrisma(): PrismaService {
  return prisma;
}
