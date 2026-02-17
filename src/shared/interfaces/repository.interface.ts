export interface IEntityExistsRepository {
  exists(where: object): Promise<boolean>;
}
