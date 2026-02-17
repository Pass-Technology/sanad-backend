export interface ApiResponse {
  body: {
    userId?: string;
    message?: string | string[];
    otp?: string;
    authToken?: string;
  };
}

export const getMessage = (res: ApiResponse): string =>
  Array.isArray(res.body.message)
    ? res.body.message.join(' ')
    : (res.body.message ?? '');
