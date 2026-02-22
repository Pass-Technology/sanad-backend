/**
 * Emitted when a user should be marked verified (e.g. after OTP validation).
 * Listener sets authToken so the emitter can return it.
 */
export class UserVerificationRequestedEvent {
  identifier!: string;
  authToken?: string;
}
