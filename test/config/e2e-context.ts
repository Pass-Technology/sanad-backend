import type { INestApplication } from '@nestjs/common';
import type { DataSource } from 'typeorm';

let app: INestApplication;
let dataSource: DataSource;

export function setE2eContext(
  application: INestApplication,
  dataSourceInstance: DataSource,
): void {
  app = application;
  dataSource = dataSourceInstance;
}

export function getE2eApp(): INestApplication {
  return app;
}

export function getE2eDataSource(): DataSource {
  return dataSource;
}
