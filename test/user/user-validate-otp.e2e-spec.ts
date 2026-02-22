import { setupE2e } from '../config/setup-e2e';
import { testRequest } from '../config/request';
import { HTTP_METHODS_ENUM } from '../config/request.methods.enum';
import { ApiResponse, getMessage } from '../helpers/api-response.helper';
import { getE2ePrisma } from '../config/e2e-context';

describe('POST /otp/validate-otp', () => {
  beforeAll(async () => {
    await setupE2e();
  });

  beforeEach(async () => {
    const prisma = getE2ePrisma();
    await prisma.otp.deleteMany();
    await prisma.user.deleteMany();
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
      url: '/otp/validate-otp',
      variables: { email, otp },
    });
    const authRes = (await authReq.expect(201)) as unknown as ApiResponse;

    expect(authRes.body).toHaveProperty('authToken');
    expect(typeof authRes.body.authToken).toBe('string');
  });

  it('should set user isVerified to true after validating OTP with email', async () => {
    const email = 'verify-email@example.com';
    const registerReq = testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/register',
      variables: { email, password: 'password123' },
    });
    const registerRes = (await registerReq.expect(
      201,
    )) as unknown as ApiResponse;

    const otp = registerRes.body.otp;

    const prisma = getE2ePrisma();
    const userBefore = await prisma.user.findUnique({ where: { email } });
    expect(userBefore?.isVerified).toBe(false);

    await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/otp/validate-otp',
      variables: { email, otp },
    }).expect(201);

    const userAfter = await prisma.user.findUnique({ where: { email } });
    expect(userAfter?.isVerified).toBe(true);
  });

  it('should set user isVerified to true after validating OTP with mobile', async () => {
    const mobile = '+1777777777';
    const registerReq = testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/register',
      variables: { mobile, password: 'password123' },
    });
    const registerRes = (await registerReq.expect(
      201,
    )) as unknown as ApiResponse;

    const otp = registerRes.body.otp;

    const prisma = getE2ePrisma();
    const userBefore = await prisma.user.findUnique({ where: { mobile } });
    expect(userBefore?.isVerified).toBe(false);

    await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/otp/validate-otp',
      variables: { mobile, otp },
    }).expect(201);

    const userAfter = await prisma.user.findUnique({ where: { mobile } });
    expect(userAfter?.isVerified).toBe(true);
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
      url: '/otp/validate-otp',
      variables: { mobile, otp },
    });
    const authRes = (await authReq.expect(201)) as unknown as ApiResponse;

    expect(authRes.body).toHaveProperty('authToken');
  });

  it('should throw validation error when neither email nor mobile provided', async () => {
    const req = testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/otp/validate-otp',
      variables: { otp: '12345' },
    });
    const res = (await req.expect(400)) as unknown as ApiResponse;

    expect(getMessage(res)).toContain(
      'Either email or mobile must be provided',
    );
  });

  it('should throw validation error when both email and mobile are empty', async () => {
    const req = testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/otp/validate-otp',
      variables: {
        email: '',
        mobile: '',
        otp: '12345',
      },
    });
    const res = (await req.expect(400)) as unknown as ApiResponse;

    expect(getMessage(res)).toContain(
      'Either email or mobile must be provided',
    );
  });

  it('should throw validation error when OTP length exceeds 5', async () => {
    const email = 'longotp@example.com';
    const registerReq = testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/register',
      variables: { email, password: 'password123' },
    });
    await registerReq.expect(201);

    const validateReq = testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/otp/validate-otp',
      variables: { email, otp: '123456' },
    });
    const res = (await validateReq.expect(400)) as unknown as ApiResponse;

    expect(getMessage(res)).toContain('OTP must be between 4 and 5 characters');
  });

  it('should throw validation error when OTP contains non-digits', async () => {
    const email = 'nonnumeric@example.com';
    const registerReq = testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/register',
      variables: { email, password: 'password123' },
    });
    await registerReq.expect(201);

    const validateReq = testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/otp/validate-otp',
      variables: { email, otp: '1234a' },
    });
    const res = (await validateReq.expect(400)) as unknown as ApiResponse;

    expect(getMessage(res)).toContain('OTP must contain only digits');
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
      url: '/otp/validate-otp',
      variables: { email, otp: '00000' },
    });
    const res = (await validateReq.expect(400)) as unknown as ApiResponse;

    expect(getMessage(res)).toContain('Invalid or expired OTP');
  });
});
