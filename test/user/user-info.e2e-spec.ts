import { setupE2e } from '../config/setup-e2e';
import { testRequest } from '../config/request';
import { HTTP_METHODS_ENUM } from '../config/request.methods.enum';
import { ApiResponse } from '../helpers/api-response.helper';
import { getE2ePrisma } from '../config/e2e-context';

describe('GET /user/info', () => {
  beforeAll(async () => {
    await setupE2e();
  });

  beforeEach(async () => {
    const prisma = getE2ePrisma();
    await prisma.otp.deleteMany();
    await prisma.user.deleteMany();
  });

  it('should return user info from token context when authenticated with email', async () => {
    const email = 'info@example.com';
    const password = 'password123';

    const registerReq = testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/register',
      variables: { email, password },
    });
    await registerReq.expect(201);

    const authReq = testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/auth',
      variables: { email, password },
    });
    const authRes = (await authReq.expect(201)) as unknown as ApiResponse;
    const token = authRes.body.authToken;

    const infoReq = testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: '/user/info',
      token,
    });
    const infoRes = (await infoReq.expect(200)) as unknown as ApiResponse;

    expect(infoRes.body).toHaveProperty('userId');
    expect(infoRes.body.userId).toBeDefined();
    expect((infoRes.body as { email?: string }).email).toBe(email);
  });

  it('should return user info from token context when authenticated with mobile', async () => {
    const mobile = '+1555555555';
    const password = 'password123';

    const registerReq = testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/register',
      variables: { mobile, password },
    });
    const registerRes = (await registerReq.expect(201)) as unknown as ApiResponse;

    const otp = registerRes.body.otp;
    const validateReq = testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/otp/validate-otp',
      variables: { mobile, otp },
    });
    await validateReq.expect(201);

    const authReq = testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/auth',
      variables: { mobile, password },
    });
    const authRes = (await authReq.expect(201)) as unknown as ApiResponse;
    const token = authRes.body.authToken;

    const infoReq = testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: '/user/info',
      token,
    });
    const infoRes = (await infoReq.expect(200)) as unknown as ApiResponse;

    expect(infoRes.body).toHaveProperty('userId');
    expect(infoRes.body.userId).toBeDefined();
    expect((infoRes.body as { mobile?: string }).mobile).toBe(mobile);
  });

  it('should return 401 when no token is provided', async () => {
    const req = testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: '/user/info',
    });
    await req.expect(401);
  });

  it('should return 401 when invalid token is provided', async () => {
    const req = testRequest({
      method: HTTP_METHODS_ENUM.GET,
      url: '/user/info',
      token: 'invalid-token',
    });
    await req.expect(401);
  });
});
