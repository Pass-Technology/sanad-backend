import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { USER_REGISTERED_EVENT } from '../../user/constants/events.constants';
import { UserRegisteredEvent } from '../../user/events/user-registered.event';
import { OtpService } from '../otp.service';

@Injectable()
export class UserRegisteredListener {
  constructor(private readonly otpService: OtpService) {}

  @OnEvent(USER_REGISTERED_EVENT)
  async handleUserRegistered(event: UserRegisteredEvent): Promise<void> {
    const { otp } = await this.otpService.createOtpForUser(
      event.userId,
      event.identifier,
    );
    event.otp = otp;
  }
}
