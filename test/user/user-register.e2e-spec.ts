import { setupE2e } from '../config/setup-e2e';
import { testRequest } from '../config/request';
import { HTTP_METHODS_ENUM } from '../config/request.methods.enum';
import { ApiResponse, getMessage } from '../helpers/api-response.helper';

describe('POST /user/register', () => {
  beforeAll(async () => {
    await setupE2e();
  });

  beforeEach(async () => {
    await global.prisma.otpVerification.deleteMany();
    await global.prisma.user.deleteMany();
  });

  it('should register with email successfully', async () => {
    const req = testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/register',
      variables: {
        email: 'test@example.com',
        password: 'password123',
      },
    });
    const res = (await req.expect(201)) as unknown as ApiResponse;

    expect(res.body).toHaveProperty('userId');
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('otp');
    expect(res.body.otp).toHaveLength(5);
  });

  it('should register with mobile successfully', async () => {
    const req = testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/register',
      variables: {
        mobile: '+1234567890',
        password: 'password123',
      },
    });
    const res = (await req.expect(201)) as unknown as ApiResponse;

    expect(res.body).toHaveProperty('userId');
    expect(res.body).toHaveProperty('otp');
  });

  it('should throw validation error when neither email nor mobile provided', async () => {
    const req = testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/register',
      variables: {
        password: 'password123',
      },
    });
    const res = (await req.expect(400)) as unknown as ApiResponse;

    expect(getMessage(res)).toContain(
      'Either email or mobile must be provided',
    );
  });

  it('should throw validation error when both email and mobile are empty', async () => {
    const req = testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/register',
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

  it('should throw validation error when password is too short', async () => {
    const req = testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/register',
      variables: {
        email: 'short@example.com',
        password: '123',
      },
    });
    await req.expect(400);
  });

  it('should throw validation error when user already exists', async () => {
    const email = 'duplicate@example.com';
    const req1 = testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/register',
      variables: { email, password: 'password123' },
    });
    await req1.expect(201);

    const req2 = testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/register',
      variables: { email, password: 'password123' },
    });
    const res = (await req2.expect(400)) as unknown as ApiResponse;
    expect(getMessage(res)).toContain(
      'User with this email or mobile already exists',
    );
  });
});
