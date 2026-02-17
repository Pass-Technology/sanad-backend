import { IEntityExistsRepository } from '../interfaces/repository.interface';

/* eslint-disable @typescript-eslint/no-unused-vars -- Generic T for type consistency */
export abstract class BaseRepository<
  T = unknown,
> implements IEntityExistsRepository {
  abstract exists(where: object): Promise<boolean>;
}
