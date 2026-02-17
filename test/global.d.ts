declare global {
  var app: import('@nestjs/common').INestApplication;

  var prisma: import('../src/prisma/prisma.service').PrismaService;
}

export {};
