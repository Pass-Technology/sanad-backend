import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { USER_VERIFICATION_REQUESTED_EVENT } from '../constants/events.constants';
import { UserVerificationRequestedEvent } from '../events/user-verification-requested.event';
import { UserService } from '../user.service';

@Injectable()
export class UserVerificationRequestedListener {
  constructor(private readonly userService: UserService) { }

  @OnEvent(USER_VERIFICATION_REQUESTED_EVENT)
  async handleUserVerificationRequested(
    event: UserVerificationRequestedEvent,
  ): Promise<void> {
    event.tokens =
      await this.userService.markVerifiedAndGenerateTokenByIdentifier(
        event.identifier,
      );
  }

}
