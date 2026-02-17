import { IEntityExistsRepository } from '../interfaces/repository.interface';

export abstract class BaseRepository<T> implements IEntityExistsRepository {
  abstract exists(where: object): Promise<boolean>;
}
