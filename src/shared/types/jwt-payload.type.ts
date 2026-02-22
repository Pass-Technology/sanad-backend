export type JwtPayload = {
  sub: string;
  email?: string | null;
  mobile?: string | null;
};
