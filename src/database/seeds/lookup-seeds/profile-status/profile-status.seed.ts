import { LookUpProfileStatusEntity } from "../../../../modules/lookups/entities/lookup-profile-status.entity";
import { DataSource, In } from "typeorm";
import { profileStatusObjects } from "./profile-status.objects";

export async function profileStatusSeed(dataSource: DataSource) {
    const profileStatusRepo = dataSource.getRepository(LookUpProfileStatusEntity);

    // save objects (will update if exists by ID or insert if not)
    await profileStatusRepo.save(profileStatusObjects);
}