import { LookUpProfileStatusEntity } from "src/modules/profile/lookup-tables/entities/lookup-profile-status.entity";
import { DataSource, In } from "typeorm";
import { profileStatusObjects } from "./profile-status.objects";

export async function profileStatusSeed(dataSource: DataSource) {
    const profileStatusRepo = dataSource.getRepository(LookUpProfileStatusEntity);

    const profileStatusKeys = profileStatusObjects.map(cycle => cycle.labelEn);

    // find all cycles
    const dbcycles = await profileStatusRepo.find({ where: { labelEn: In(profileStatusKeys) } });

    // filter objects that are not in db
    const objectsToInsert = profileStatusObjects.filter(cycle => !dbcycles.some(dbcycle => dbcycle.labelEn === cycle.labelEn));

    // insert objects
    await profileStatusRepo.insert(objectsToInsert);
}