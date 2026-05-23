import { DataSource } from 'typeorm';
import { LookupUnitEntity } from '../../../modules/lookups/entities/lookup-unit.entity';
import { UnitStaticCode } from '../../../modules/lookups/enums/lookup-static-codes.enum';

export async function unitSeed(dataSource: DataSource) {
    const repository = dataSource.getRepository(LookupUnitEntity);

    const units = [
        { id: '200e8400-e29b-41d4-a716-446655440001', labelEn: 'Meter', labelAr: 'متر', staticCode: UnitStaticCode.METER },
        { id: '200e8400-e29b-41d4-a716-446655440002', labelEn: 'Hour', labelAr: 'ساعة', staticCode: UnitStaticCode.HOUR },
        { id: '200e8400-e29b-41d4-a716-446655440003', labelEn: 'Day', labelAr: 'يوم', staticCode: UnitStaticCode.DAY },
        { id: '200e8400-e29b-41d4-a716-446655440004', labelEn: 'Piece', labelAr: 'قطعة', staticCode: UnitStaticCode.PIECE },
        { id: '200e8400-e29b-41d4-a716-446655440005', labelEn: 'Kilogram', labelAr: 'كيلوغرام', staticCode: UnitStaticCode.KILOGRAM },
        { id: '200e8400-e29b-41d4-a716-446655440006', labelEn: 'Kilometer', labelAr: 'كيلومتر', staticCode: UnitStaticCode.KILOMETER },
    ];

    console.log('Seeding Units...');

    for (const item of units) {
        let entity = await repository.findOne({ where: { id: item.id } });
        if (!entity) {
            entity = repository.create(item);
        } else {
            Object.assign(entity, item);
        }
        await repository.save(entity);
    }
}
