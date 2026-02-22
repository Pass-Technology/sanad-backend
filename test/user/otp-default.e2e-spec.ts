import { setupE2e } from '../config/setup-e2e';
import { testRequest } from '../config/request';
import { HTTP_METHODS_ENUM } from '../config/request.methods.enum';
import { ApiResponse } from '../helpers/api-response.helper';
import { getE2ePrisma } from '../config/e2e-context';

const DEFAULT_OTP_VALUE = '99999';

describe('Default OTP (DEFAULT_OTP env)', () => {
  const originalDefaultOtp = process.env.DEFAULT_OTP;

  beforeAll(async () => {
    process.env.DEFAULT_OTP = DEFAULT_OTP_VALUE;
    await setupE2e();
  });

  afterAll(() => {
    if (originalDefaultOtp !== undefined) {
      process.env.DEFAULT_OTP = originalDefaultOtp;
    } else {
      delete process.env.DEFAULT_OTP;
    }
  });

  beforeEach(async () => {
    const prisma = getE2ePrisma();
    await prisma.otp.deleteMany();
    await prisma.user.deleteMany();
  });

  it('should return default OTP on register when DEFAULT_OTP is set', async () => {
    const email = 'defaultotp@example.com';
    const registerRes = (await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/register',
      variables: { email, password: 'password123' },
    }).expect(201)) as unknown as ApiResponse;

    expect(registerRes.body).toHaveProperty('otp', DEFAULT_OTP_VALUE);
    expect(registerRes.body.message).toContain('verify your OTP');
  });

  it('should accept default OTP on validate-otp and return auth token (email)', async () => {
    const email = 'defaultvalidate@example.com';
    await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/register',
      variables: { email, password: 'password123' },
    }).expect(201);

    const authRes = (await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/otp/validate-otp',
      variables: { email, otp: DEFAULT_OTP_VALUE },
    }).expect(201)) as unknown as ApiResponse;

    expect(authRes.body).toHaveProperty('authToken');
    expect(typeof authRes.body.authToken).toBe('string');
  });

  it('should accept default OTP on validate-otp and return auth token (mobile)', async () => {
    const mobile = '+1777123456';
    await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/register',
      variables: { mobile, password: 'password123' },
    }).expect(201);

    const authRes = (await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/otp/validate-otp',
      variables: { mobile, otp: DEFAULT_OTP_VALUE },
    }).expect(201)) as unknown as ApiResponse;

    expect(authRes.body).toHaveProperty('authToken');
    expect(typeof authRes.body.authToken).toBe('string');
  });

  it('should accept default OTP without stored OTP record (by identifier)', async () => {
    const email = 'defaultonly@example.com';
    await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/register',
      variables: { email, password: 'password123' },
    }).expect(201);

    const prisma = getE2ePrisma();
    await prisma.otp.deleteMany();

    const authRes = (await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/otp/validate-otp',
      variables: { email, otp: DEFAULT_OTP_VALUE },
    }).expect(201)) as unknown as ApiResponse;

    expect(authRes.body).toHaveProperty('authToken');
  });
});
