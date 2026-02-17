import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';

export async function setupE2e(): Promise<{
  app: INestApplication;
  prisma: PrismaService;
}> {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  const prisma = moduleFixture.get<PrismaService>(PrismaService);

  useContainer(moduleFixture, { fallbackOnErrors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  await app.init();

  (global as any).app = app;
  (global as any).prisma = prisma;

  return { app, prisma };
}
