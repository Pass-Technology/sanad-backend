import { setupE2e } from '../config/setup-e2e';
import { testRequest } from '../config/request';
import { HTTP_METHODS_ENUM } from '../config/request.methods.enum';
import { ApiResponse, getMessage } from '../helpers/api-response.helper';
import { getE2ePrisma } from '../config/e2e-context';

describe('POST /user/auth', () => {
  beforeAll(async () => {
    await setupE2e();
  });

  beforeEach(async () => {
    const prisma = getE2ePrisma();
    await prisma.otpVerification.deleteMany();
    await prisma.user.deleteMany();
  });

  it('should authenticate with email and return auth token', async () => {
    const email = 'authtest@example.com';
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

    expect(authRes.body).toHaveProperty('authToken');
  });

  it('should authenticate with mobile and password', async () => {
    const mobile = '+1555555555';
    const password = 'password123';
    const registerReq = testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/register',
      variables: { mobile, password },
    });
    const registerRes = (await registerReq.expect(
      201,
    )) as unknown as ApiResponse;

    const otp = registerRes.body.otp;
    const validateReq = testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/validate-otp',
      variables: { mobile, otp },
    });
    await validateReq.expect(201);

    const authReq = testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/auth',
      variables: { mobile, password },
    });
    const authRes = (await authReq.expect(201)) as unknown as ApiResponse;

    expect(authRes.body).toHaveProperty('authToken');
  });

  it('should throw validation error when neither email nor mobile provided', async () => {
    const req = testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/auth',
      variables: { password: 'password123' },
    });
    const res = (await req.expect(400)) as unknown as ApiResponse;

    expect(getMessage(res)).toContain(
      'Either email or mobile must be provided',
    );
  });

  it('should throw validation error when both email and mobile are empty', async () => {
    const req = testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/auth',
      variables: {
        email: '',
        mobile: '',
        password: 'password123',
      },
    });
    const res = (await req.expect(400)) as unknown as ApiResponse;

    expect(getMessage(res)).toContain(
      'Either email or mobile must be provided',
    );
  });

  it('should throw unauthorized for invalid password', async () => {
    const email = 'wrongpass@example.com';
    const registerReq = testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/register',
      variables: { email, password: 'password123' },
    });
    await registerReq.expect(201);

    const authReq = testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/auth',
      variables: { email, password: 'wrongpassword' },
    });
    await authReq.expect(401);
  });

    it('should throw validation error for non-existent user', async () => {
      const req = testRequest({
        method: HTTP_METHODS_ENUM.POST,
        url: '/user/auth',
        variables: {
          email: 'nonexistent@example.com',
          password: 'password123',
        },
      });
      const res = (await req.expect(400)) as unknown as ApiResponse;

      expect(getMessage(res)).toContain('Invalid credentials');
    });
});
