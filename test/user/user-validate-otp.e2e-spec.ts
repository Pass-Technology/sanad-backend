import { setupE2e } from '../config/setup-e2e';
import { testRequest } from '../config/request';
import { HTTP_METHODS_ENUM } from '../config/request.methods.enum';
import { ApiResponse, getMessage } from '../helpers/api-response.helper';

describe('POST /user/validate-otp', () => {
  beforeAll(async () => {
    await setupE2e();
  });

  beforeEach(async () => {
    await global.prisma.otpVerification.deleteMany();
    await global.prisma.user.deleteMany();
  });

  it('should validate OTP and return auth token', async () => {
    const email = 'otptest@example.com';
    const registerReq = testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/register',
      variables: { email, password: 'password123' },
    });
    const registerRes = (await registerReq.expect(
      201,
    )) as unknown as ApiResponse;

    const otp = registerRes.body.otp;

    const authReq = testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/validate-otp',
      variables: { email, otp },
    });
    const authRes = (await authReq.expect(201)) as unknown as ApiResponse;

    expect(authRes.body).toHaveProperty('authToken');
    expect(typeof authRes.body.authToken).toBe('string');
  });

  it('should validate OTP with mobile', async () => {
    const mobile = '+1987654321';
    const registerReq = testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/register',
      variables: { mobile, password: 'password123' },
    });
    const registerRes = (await registerReq.expect(
      201,
    )) as unknown as ApiResponse;

    const otp = registerRes.body.otp;

    const authReq = testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/validate-otp',
      variables: { mobile, otp },
    });
    const authRes = (await authReq.expect(201)) as unknown as ApiResponse;

    expect(authRes.body).toHaveProperty('authToken');
  });

  it('should throw validation error when neither email nor mobile provided', async () => {
    const req = testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/validate-otp',
      variables: { otp: '123456' },
    });
    const res = (await req.expect(400)) as unknown as ApiResponse;

    expect(getMessage(res)).toContain(
      'Either email or mobile must be provided',
    );
  });

  it('should throw validation error when both email and mobile are empty', async () => {
    const req = testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/validate-otp',
      variables: {
        email: '',
        mobile: '',
        otp: '123456',
      },
    });
    const res = (await req.expect(400)) as unknown as ApiResponse;

    expect(getMessage(res)).toContain(
      'Either email or mobile must be provided',
    );
  });

  it('should throw validation error for invalid OTP', async () => {
    const email = 'invalidotp@example.com';
    const registerReq = testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/register',
      variables: { email, password: 'password123' },
    });
    await registerReq.expect(201);

    const validateReq = testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/validate-otp',
      variables: { email, otp: '000000' },
    });
    const res = (await validateReq.expect(400)) as unknown as ApiResponse;

    expect(getMessage(res)).toContain('Invalid or expired OTP');
  });
});
