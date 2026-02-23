import { setupE2e } from '../config/setup-e2e';
import { testRequest } from '../config/request';
import { HTTP_METHODS_ENUM } from '../config/request.methods.enum';
import { ApiResponse, getMessage } from '../helpers/api-response.helper';
import { getE2ePrisma } from '../config/e2e-context';

describe('POST /otp/send', () => {
  beforeAll(async () => {
    await setupE2e();
  });

  beforeEach(async () => {
    const prisma = getE2ePrisma();
    await prisma.otp.deleteMany();
    await prisma.user.deleteMany();
  });

  it('should send OTP by email when user exists', async () => {
    const email = 'sendotp@example.com';
    await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/register',
      variables: { email, password: 'password123' },
    }).expect(201);

    const res = (await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/otp/send',
      variables: { email },
    }).expect(201)) as unknown as ApiResponse;

    expect(res.body).toHaveProperty('message', 'OTP sent successfully');

    const prisma = getE2ePrisma();
    const otpRecord = await prisma.otp.findFirst({
      where: { identifier: email },
    });
    expect(otpRecord).not.toBeNull();
    expect(otpRecord!.otp).toMatch(/^\d{4,5}$/);
    expect(otpRecord!.expiresAt.getTime()).toBeGreaterThan(Date.now());
  });

  it('should send OTP by mobile when user exists', async () => {
    const mobile = '+1999888777';
    await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/register',
      variables: { mobile, password: 'password123' },
    }).expect(201);

    const res = (await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/otp/send',
      variables: { mobile },
    }).expect(201)) as unknown as ApiResponse;

    expect(res.body).toHaveProperty('message', 'OTP sent successfully');

    const prisma = getE2ePrisma();
    const otpRecord = await prisma.otp.findFirst({
      where: { identifier: mobile },
    });
    expect(otpRecord).not.toBeNull();
  });

  it('should return 400 when user with email does not exist', async () => {
    const res = (await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/otp/send',
      variables: { email: 'nonexistent@example.com' },
    }).expect(400)) as unknown as ApiResponse;

    expect(getMessage(res)).toContain('does not exist');
  });

  it('should return 400 when user with mobile does not exist', async () => {
    const res = (await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/otp/send',
      variables: { mobile: '+1000000000' },
    }).expect(400)) as unknown as ApiResponse;

    expect(getMessage(res)).toContain('does not exist');
  });

  it('should return 400 when neither email nor mobile provided', async () => {
    const res = (await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/otp/send',
      variables: {},
    }).expect(400)) as unknown as ApiResponse;

    expect(getMessage(res)).toContain('Either email or mobile must be provided');
  });

  it('should replace existing OTP when sending again for same identifier', async () => {
    const email = 'replace@example.com';
    await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/register',
      variables: { email, password: 'password123' },
    }).expect(201);

    await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/otp/send',
      variables: { email },
    }).expect(201);

    await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/otp/send',
      variables: { email },
    }).expect(201);

    const prisma = getE2ePrisma();
    const otpRecords = await prisma.otp.findMany({
      where: { identifier: email },
    });
    expect(otpRecords).toHaveLength(1);
  });
});

describe('POST /otp/send with DEFAULT_OTP', () => {
  const DEFAULT_OTP_VALUE = '88888';
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

  it('should store default OTP in database when DEFAULT_OTP is set (email)', async () => {
    const email = 'defaultsend@example.com';
    await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/register',
      variables: { email, password: 'password123' },
    }).expect(201);

    const prisma = getE2ePrisma();
    await prisma.otp.deleteMany();

    await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/otp/send',
      variables: { email },
    }).expect(201);

    const otpRecord = await prisma.otp.findFirst({
      where: { identifier: email },
    });
    expect(otpRecord).not.toBeNull();
    expect(otpRecord!.otp).toBe(DEFAULT_OTP_VALUE);
  });

  it('should store default OTP in database when DEFAULT_OTP is set (mobile)', async () => {
    const mobile = '+1555123456';
    await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/register',
      variables: { mobile, password: 'password123' },
    }).expect(201);

    const prisma = getE2ePrisma();
    await prisma.otp.deleteMany();

    await testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/otp/send',
      variables: { mobile },
    }).expect(201);

    const otpRecord = await prisma.otp.findFirst({
      where: { identifier: mobile },
    });
    expect(otpRecord).not.toBeNull();
    expect(otpRecord!.otp).toBe(DEFAULT_OTP_VALUE);
  });
});
