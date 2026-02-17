import type { Agent, Test } from 'supertest';
// eslint-disable-next-line @typescript-eslint/no-require-imports -- supertest CommonJS default export
const request = require('supertest') as (app: unknown) => Agent;
import { HTTP_METHODS_ENUM } from './request.methods.enum';
import { isArray } from 'class-validator';
import * as qs from 'qs';

interface TestRequestInput<T = Record<string, unknown>> {
  method: HTTP_METHODS_ENUM;
  url: string;
  variables?: T;
  params?: T;
  token?: string;
  fileParam?: string;
  filePath?: string;
  fileParams?: string[];
  headers?: Record<string, string>;
}

const createRequest = (
  server: Agent,
  method: HTTP_METHODS_ENUM,
  url: string,
) => {
  switch (method) {
    case HTTP_METHODS_ENUM.POST:
      return server.post(url);
    case HTTP_METHODS_ENUM.GET:
      return server.get(url);
    case HTTP_METHODS_ENUM.PUT:
      return server.put(url);
    case HTTP_METHODS_ENUM.DELETE:
      return server.delete(url);
    default:
      throw new Error('Invalid HTTP method');
  }
};

const setRequestFields = <T>(req: Test, input: TestRequestInput<T>): void => {
  if (input.variables && input.fileParam) {
    Object.entries(input.variables as Record<string, unknown>).forEach(
      ([key, value]) => {
        if (typeof value === 'object' && isArray(value)) {
          value.forEach((item: unknown, index: number) => {
            req.field(
              `${key}[${index}]`,
              typeof item === 'string' ? item : JSON.stringify(item),
            );
          });
        } else {
          req.field(
            key,
            typeof value === 'string' ? value : JSON.stringify(value),
          );
        }
      },
    );
  }
};

const setRequestFiles = <T>(req: Test, input: TestRequestInput<T>): void => {
  if (input.fileParam && input.filePath) {
    req.attach(input.fileParam, input.filePath);
  } else if (input.fileParams && input.filePath) {
    input.fileParams.forEach((param) => {
      req.attach(param, input.filePath!);
    });
  } else if (input.fileParam) {
    req.attach(
      input.fileParam,
      `${process.cwd()}/test/test-files/test-duck.jpeg`,
    );
  } else if (input.variables) {
    req.send(input.variables);
  }
};

export const testRequest = <T = Record<string, unknown>>(
  input: TestRequestInput<T>,
): Test => {
  const server = request(global.app.getHttpServer());
  let req: Test = createRequest(server, input.method, input.url);

  setRequestFields(req, input);
  setRequestFiles(req, input);

  if (input.token) req.set('Authorization', `Bearer ${input.token}`);
  if (input.headers) {
    Object.entries(input.headers).forEach(([header, value]) => {
      req.set(header, value);
    });
  }
  if (input.params) {
    req = req.query(qs.stringify(input.params as Record<string, unknown>));
  }
  return req;
};
