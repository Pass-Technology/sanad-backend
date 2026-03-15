import { UserEntity } from "../entities/user.entity";

export type UserPayloadType = Pick<
    UserEntity,
    'id' | 'identifier' | 'identifierType' | 'isVerified' | 'isProfileCompleted'
>;
