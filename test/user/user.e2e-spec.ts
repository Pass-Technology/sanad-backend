import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { testRequest } from '../config/request';
import { HTTP_METHODS_ENUM } from '../config/request.methods.enum';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    useContainer(moduleFixture, { fallbackOnErrors: true });
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    await app.init();
    (global as any).app = app;
  });

  beforeEach(async () => {
    await prisma.otpVerification.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /user/register', () => {
    it('should register with email successfully', async () => {
      const req = testRequest({
        method: HTTP_METHODS_ENUM.POST,
        url: '/user/register',
        variables: {
          email: 'test@example.com',
          password: 'password123',
        },
      });
      const res = await req.expect(201);

      const body = res.body;
      expect(body).toHaveProperty('userId');
      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('otp');
      expect(body.otp).toHaveLength(6);
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
      const res = await req.expect(201);

      const body = res.body;
      expect(body).toHaveProperty('userId');
      expect(body).toHaveProperty('otp');
    });

    it('should throw validation error when neither email nor mobile provided', async () => {
      const req = testRequest({
        method: HTTP_METHODS_ENUM.POST,
        url: '/user/register',
        variables: {
          password: 'password123',
        },
      });
      const res = await req.expect(400);

      expect(res.body.message).toContain('Either email or mobile must be provided');
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
      const res = await req.expect(400);

      expect(res.body.message).toContain('Either email or mobile must be provided');
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
      const res = await req2.expect(400);
      expect(res.body.message).toContain('User with this email or mobile already exists');
    });
  });

  describe('POST /user/validate-otp', () => {
    it('should validate OTP and return auth token', async () => {
      const email = 'otptest@example.com';
      const registerReq = testRequest({
        method: HTTP_METHODS_ENUM.POST,
        url: '/user/register',
        variables: { email, password: 'password123' },
      });
      const registerRes = await registerReq.expect(201);

      const { otp } = registerRes.body;

      const authReq = testRequest({
        method: HTTP_METHODS_ENUM.POST,
        url: '/user/validate-otp',
        variables: { email, otp },
      });
      const authRes = await authReq.expect(201);

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
      const registerRes = await registerReq.expect(201);

      const { otp } = registerRes.body;

      const authReq = testRequest({
        method: HTTP_METHODS_ENUM.POST,
        url: '/user/validate-otp',
        variables: { mobile, otp },
      });
      const authRes = await authReq.expect(201);

      expect(authRes.body).toHaveProperty('authToken');
    });

    it('should throw validation error when neither email nor mobile provided', async () => {
      const req = testRequest({
        method: HTTP_METHODS_ENUM.POST,
        url: '/user/validate-otp',
        variables: { otp: '123456' },
      });
      const res = await req.expect(400);

      expect(res.body.message).toContain('Either email or mobile must be provided');
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
      const res = await req.expect(400);

      expect(res.body.message).toContain('Either email or mobile must be provided');
    });

    it('should throw unauthorized for invalid OTP', async () => {
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
      await validateReq.expect(401);
    });
  });

  describe('POST /user/auth', () => {
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
      const authRes = await authReq.expect(201);

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
      const registerRes = await registerReq.expect(201);

      const { otp } = registerRes.body;
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
      const authRes = await authReq.expect(201);

      expect(authRes.body).toHaveProperty('authToken');
    });

    it('should throw validation error when neither email nor mobile provided', async () => {
      const req = testRequest({
        method: HTTP_METHODS_ENUM.POST,
        url: '/user/auth',
        variables: { password: 'password123' },
      });
      const res = await req.expect(400);

      expect(res.body.message).toContain('Either email or mobile must be provided');
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
      const res = await req.expect(400);

      expect(res.body.message).toContain('Either email or mobile must be provided');
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

    it('should throw unauthorized for non-existent user', async () => {
      const req = testRequest({
        method: HTTP_METHODS_ENUM.POST,
        url: '/user/auth',
        variables: {
          email: 'nonexistent@example.com',
          password: 'password123',
        },
      });
      await req.expect(401);
    });
  });
});
