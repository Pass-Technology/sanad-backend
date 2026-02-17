import * as request from 'supertest';
import { HTTP_METHODS_ENUM } from './request.methods.enum';
import { isArray } from 'class-validator';
import * as qs from 'qs';

const createRequest = (
  server: request.Agent,
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

const setRequestFields = (req: request.Test, input: any) => {
  if (input.variables && input.fileParam) {
    Object.entries(input.variables).forEach(([key, value]) => {
      if (typeof value === 'object' && isArray(value)) {
        value.forEach((item, index) => {
          req.field(`${key}[${index}]`, item);
        });
      } else {
        req.field(
          key,
          typeof value === 'string' ? value : JSON.stringify(value),
        );
      }
    });
  }
};

const setRequestFiles = (req: request.Test, input: any) => {
  if (input.fileParam && input.filePath) {
    req.attach(input.fileParam, input.filePath);
  } else if (input.fileParams) {
    input.fileParams.forEach((param) => {
      req.attach(param, input.filePath);
    });
  } else if (input.fileParam) {
    req.attach(
      input.fileParam,
      `${process.cwd()}/test/test-files/test-duck.jpeg`,
    );
  } else {
    req.send(input.variables);
  }
};

export const testRequest = <T>(input: {
  method: HTTP_METHODS_ENUM;
  url: string;
  variables?: T;
  params?: T;
  token?: string;
  fileParam?: string;
  filePath?: string;
  fileParams?: string[];
  headers?: Record<any, any>;
}): request.Test => {
  const server = (request as any)(global.app.getHttpServer());
  let req: request.Test = createRequest(server, input.method, input.url);

  setRequestFields(req, input);
  setRequestFiles(req, input);

  if (input.token) req.set('Authorization', `Bearer ${input.token}`);
  if (input.headers) {
    Object.entries(input.headers).forEach(([header, value]) => {
      req.set(header, value);
    });
  }
  if (input.params) {
    req = req.query(qs.stringify(input.params));
  }
  return req;
};
