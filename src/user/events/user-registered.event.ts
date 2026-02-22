/**
 * Event payload for user.registered. Listeners may set `otp` on the instance
 * so the emitter can include it in the response (e.g. when using emitAsync).
 */
export class UserRegisteredEvent {
  userId!: string;
  identifier!: string;
  otp?: string;
}
