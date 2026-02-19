import { setupE2e } from '../config/setup-e2e';
import { testRequest } from '../config/request';
import { HTTP_METHODS_ENUM } from '../config/request.methods.enum';
import { ApiResponse, getMessage } from '../helpers/api-response.helper';
import { getE2ePrisma } from '../config/e2e-context';

describe('POST /user/change-password', () => {
  beforeAll(async () => {
    await setupE2e();
  });

  beforeEach(async () => {
    const prisma = getE2ePrisma();
    await prisma.otpVerification.deleteMany();
    await prisma.user.deleteMany();
  });

  it('should change password successfully with email and valid token', async () => {
    const email = 'changepass@example.com';
    const oldPassword = 'oldpassword123';
    const newPassword = 'newpassword123';

    // Register user
    const registerReq = testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/register',
      variables: { email, password: oldPassword },
    });
    await registerReq.expect(201);

    // Authenticate to get token
    const authReq = testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/auth',
      variables: { email, password: oldPassword },
    });
    const authRes = (await authReq.expect(201)) as unknown as ApiResponse;
    const token = authRes.body.authToken;

    // Change password
    const changePasswordReq = testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/change-password',
      variables: { email, password: newPassword },
      token,
    });
    const changePasswordRes = (await changePasswordReq.expect(
      201,
    )) as unknown as ApiResponse;

    expect(changePasswordRes.body.message).toBe('Password changed successfully');

    // Verify new password works
    const newAuthReq = testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/auth',
      variables: { email, password: newPassword },
    });
    await newAuthReq.expect(201);

    // Verify old password doesn't work
    const oldAuthReq = testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/auth',
      variables: { email, password: oldPassword },
    });
    await oldAuthReq.expect(401);
  });

  it('should change password successfully with mobile and valid token', async () => {
    const mobile = '+1555555555';
    const oldPassword = 'oldpassword123';
    const newPassword = 'newpassword123';

    // Register user
    const registerReq = testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/register',
      variables: { mobile, password: oldPassword },
    });
    const registerRes = (await registerReq.expect(201)) as unknown as ApiResponse;

    // Validate OTP
    const otp = registerRes.body.otp;
    const validateReq = testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/validate-otp',
      variables: { mobile, otp },
    });
    await validateReq.expect(201);

    // Authenticate to get token
    const authReq = testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/auth',
      variables: { mobile, password: oldPassword },
    });
    const authRes = (await authReq.expect(201)) as unknown as ApiResponse;
    const token = authRes.body.authToken;

    // Change password
    const changePasswordReq = testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/change-password',
      variables: { mobile, password: newPassword },
      token,
    });
    const changePasswordRes = (await changePasswordReq.expect(
      201,
    )) as unknown as ApiResponse;

    expect(changePasswordRes.body.message).toBe('Password changed successfully');

    // Verify new password works
    const newAuthReq = testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/auth',
      variables: { mobile, password: newPassword },
    });
    await newAuthReq.expect(201);

    // Verify old password doesn't work
    const oldAuthReq = testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/auth',
      variables: { mobile, password: oldPassword },
    });
    await oldAuthReq.expect(401);
  });

  it('should return 401 when no token is provided', async () => {
    const email = 'notoken@example.com';
    const password = 'password123';

    const req = testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/change-password',
      variables: { email, password },
    });
    await req.expect(401);
  });

  it('should return 401 when invalid token is provided', async () => {
    const email = 'invalidtoken@example.com';
    const password = 'password123';

    const req = testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/change-password',
      variables: { email, password },
      token: 'invalid-token',
    });
    await req.expect(401);
  });

  it('should return 401 when email does not match authenticated user', async () => {
    const email1 = 'user1@example.com';
    const email2 = 'user2@example.com';
    const password = 'password123';

    // Register and authenticate user1
    const registerReq1 = testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/register',
      variables: { email: email1, password },
    });
    await registerReq1.expect(201);

    const authReq1 = testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/auth',
      variables: { email: email1, password },
    });
    const authRes1 = (await authReq1.expect(201)) as unknown as ApiResponse;
    const token1 = authRes1.body.authToken;

    // Register user2
    const registerReq2 = testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/register',
      variables: { email: email2, password },
    });
    await registerReq2.expect(201);

    // Try to change password for user2 using user1's token
    const changePasswordReq = testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/change-password',
      variables: { email: email2, password: 'newpassword123' },
      token: token1,
    });
    const changePasswordRes = (await changePasswordReq.expect(
      401,
    )) as unknown as ApiResponse;

    expect(getMessage(changePasswordRes)).toContain(
      'Email or mobile does not match authenticated user',
    );
  });

  it('should return 401 when mobile does not match authenticated user', async () => {
    const mobile1 = '+1555555555';
    const mobile2 = '+1666666666';
    const password = 'password123';

    // Register and authenticate user1
    const registerReq1 = testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/register',
      variables: { mobile: mobile1, password },
    });
    const registerRes1 = (await registerReq1.expect(201)) as unknown as ApiResponse;

    const otp1 = registerRes1.body.otp;
    const validateReq1 = testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/validate-otp',
      variables: { mobile: mobile1, otp: otp1 },
    });
    await validateReq1.expect(201);

    const authReq1 = testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/auth',
      variables: { mobile: mobile1, password },
    });
    const authRes1 = (await authReq1.expect(201)) as unknown as ApiResponse;
    const token1 = authRes1.body.authToken;

    // Register user2
    const registerReq2 = testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/register',
      variables: { mobile: mobile2, password },
    });
    const registerRes2 = (await registerReq2.expect(201)) as unknown as ApiResponse;

    const otp2 = registerRes2.body.otp;
    const validateReq2 = testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/validate-otp',
      variables: { mobile: mobile2, otp: otp2 },
    });
    await validateReq2.expect(201);

    // Try to change password for user2 using user1's token
    const changePasswordReq = testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/change-password',
      variables: { mobile: mobile2, password: 'newpassword123' },
      token: token1,
    });
    const changePasswordRes = (await changePasswordReq.expect(
      401,
    )) as unknown as ApiResponse;

    expect(getMessage(changePasswordRes)).toContain(
      'Email or mobile does not match authenticated user',
    );
  });

  it('should return 400 when neither email nor mobile is provided', async () => {
    const email = 'validation@example.com';
    const password = 'password123';

    // Register and authenticate
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

    // Try to change password without email or mobile
    const changePasswordReq = testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/change-password',
      variables: { password: 'newpassword123' },
      token,
    });
    const changePasswordRes = (await changePasswordReq.expect(
      400,
    )) as unknown as ApiResponse;

    expect(getMessage(changePasswordRes)).toContain(
      'Either email or mobile must be provided',
    );
  });

  it('should return 400 when password is too short', async () => {
    const email = 'shortpass@example.com';
    const password = 'password123';

    // Register and authenticate
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

    // Try to change password with short password
    const changePasswordReq = testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/change-password',
      variables: { email, password: '12345' },
      token,
    });
    const changePasswordRes = (await changePasswordReq.expect(
      400,
    )) as unknown as ApiResponse;

    expect(getMessage(changePasswordRes)).toContain(
      'Password must be at least 6 characters',
    );
  });

  it('should return 400 when user with provided email does not exist', async () => {
    const email = 'exists@example.com';
    const nonExistentEmail = 'nonexistent@example.com';
    const password = 'password123';

    // Register and authenticate
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

    // Try to change password with non-existent email
    const changePasswordReq = testRequest({
      method: HTTP_METHODS_ENUM.POST,
      url: '/user/change-password',
      variables: { email: nonExistentEmail, password: 'newpassword123' },
      token,
    });
    const changePasswordRes = (await changePasswordReq.expect(
      400,
    )) as unknown as ApiResponse;

    expect(getMessage(changePasswordRes)).toContain('Invalid credentials');
  });
});
