import { LookupNationalityEntity } from "src/modules/lookups/entities/lookup-nationality.entity";
import { NationalityStaticCode } from "src/modules/lookups/enums/lookup-static-codes.enum";
import { DataSource } from "typeorm";


export async function nationalitiesSeed(dataSource: DataSource) {
    const repo = dataSource.getRepository(LookupNationalityEntity);

    const data = [
        { id: '100e8400-e29b-41d4-a716-446655440001', labelEn: 'Emirati', labelAr: 'إماراتي', flag: '🇦🇪', staticCode: NationalityStaticCode.EMIRATI },
        { id: '100e8400-e29b-41d4-a716-446655440002', labelEn: 'Indian', labelAr: 'هندي', flag: '🇮🇳', staticCode: NationalityStaticCode.INDIAN },
        { id: '100e8400-e29b-41d4-a716-446655440003', labelEn: 'Pakistani', labelAr: 'باكستاني', flag: '🇵🇰', staticCode: NationalityStaticCode.PAKISTANI },
        { id: '100e8400-e29b-41d4-a716-446655440004', labelEn: 'Bangladeshi', labelAr: 'بنغلاديشي', flag: '🇧🇩', staticCode: NationalityStaticCode.BANGLADESHI },
        { id: '100e8400-e29b-41d4-a716-446655440005', labelEn: 'Filipino', labelAr: 'فلبيني', flag: '🇵🇭', staticCode: NationalityStaticCode.FILIPINO },
        { id: '100e8400-e29b-41d4-a716-446655440006', labelEn: 'Egyptian', labelAr: 'مصري', flag: '🇪🇬', staticCode: NationalityStaticCode.EGYPTIAN },
        { id: '100e8400-e29b-41d4-a716-446655440007', labelEn: 'Lebanese', labelAr: 'لبناني', flag: '🇱🇧', staticCode: NationalityStaticCode.LEBANESE },
        { id: '100e8400-e29b-41d4-a716-446655440008', labelEn: 'Jordanian', labelAr: 'أردني', flag: '🇯🇴', staticCode: NationalityStaticCode.JORDANIAN },
        { id: '100e8400-e29b-41d4-a716-446655440009', labelEn: 'Syrian', labelAr: 'سوري', flag: '🇸🇾', staticCode: NationalityStaticCode.SYRIAN },
        { id: '100e8400-e29b-41d4-a716-446655440010', labelEn: 'Sudanese', labelAr: 'سوداني', flag: '🇸🇩', staticCode: NationalityStaticCode.SUDANESE },
        { id: '100e8400-e29b-41d4-a716-446655440011', labelEn: 'Yemeni', labelAr: 'يمني', flag: '🇾🇪', staticCode: NationalityStaticCode.YEMENI },
        { id: '100e8400-e29b-41d4-a716-446655440012', labelEn: 'Iraqi', labelAr: 'عراقي', flag: '🇮🇶', staticCode: NationalityStaticCode.IRAQI },
        { id: '100e8400-e29b-41d4-a716-446655440013', labelEn: 'Iranian', labelAr: 'إيراني', flag: '🇮🇷', staticCode: NationalityStaticCode.IRANIAN },
        { id: '100e8400-e29b-41d4-a716-446655440014', labelEn: 'Saudi', labelAr: 'سعودي', flag: '🇸🇦', staticCode: NationalityStaticCode.SAUDI },
        { id: '100e8400-e29b-41d4-a716-446655440015', labelEn: 'Nepalese', labelAr: 'نيبالي', flag: '🇳🇵', staticCode: NationalityStaticCode.NEPALESE },
        { id: '100e8400-e29b-41d4-a716-446655440016', labelEn: 'Sri Lankan', labelAr: 'سريلانكي', flag: '🇱🇰', staticCode: NationalityStaticCode.SRI_LANKAN },
        { id: '100e8400-e29b-41d4-a716-446655440017', labelEn: 'Chinese', labelAr: 'صيني', flag: '🇨🇳', staticCode: NationalityStaticCode.CHINESE },
        { id: '100e8400-e29b-41d4-a716-446655440018', labelEn: 'British', labelAr: 'بريطاني', flag: '🇬🇧', staticCode: NationalityStaticCode.BRITISH },
        { id: '100e8400-e29b-41d4-a716-446655440019', labelEn: 'American', labelAr: 'أمريكي', flag: '🇺🇸', staticCode: NationalityStaticCode.AMERICAN },
        { id: '100e8400-e29b-41d4-a716-446655440020', labelEn: 'Russian', labelAr: 'روسي', flag: '🇷🇺', staticCode: NationalityStaticCode.RUSSIAN },
        { id: '100e8400-e29b-41d4-a716-446655440021', labelEn: 'Turkish', labelAr: 'تركي', flag: '🇹🇷', staticCode: NationalityStaticCode.TURKISH },
        { id: '100e8400-e29b-41d4-a716-446655440022', labelEn: 'Afghan', labelAr: 'أفغاني', flag: '🇦🇫', staticCode: NationalityStaticCode.AFGHAN },
        { id: '100e8400-e29b-41d4-a716-446655440023', labelEn: 'Nigerian', labelAr: 'نيجيري', flag: '🇳🇬', staticCode: NationalityStaticCode.NIGERIAN },
        { id: '100e8400-e29b-41d4-a716-446655440024', labelEn: 'Ethiopian', labelAr: 'إثيوبي', flag: '🇪🇹', staticCode: NationalityStaticCode.ETHIOPIAN },
        { id: '100e8400-e29b-41d4-a716-446655440025', labelEn: 'Indonesian', labelAr: 'إندونيسي', flag: '🇮🇩', staticCode: NationalityStaticCode.INDONESIAN },
        { id: '100e8400-e29b-41d4-a716-446655440026', labelEn: 'Moroccan', labelAr: 'مغربي', flag: '🇲🇦', staticCode: NationalityStaticCode.MOROCCAN },
        { id: '100e8400-e29b-41d4-a716-446655440027', labelEn: 'French', labelAr: 'فرنسي', flag: '🇫🇷', staticCode: NationalityStaticCode.FRENCH },
        { id: '100e8400-e29b-41d4-a716-446655440028', labelEn: 'German', labelAr: 'ألماني', flag: '🇩🇪', staticCode: NationalityStaticCode.GERMAN },
        { id: '100e8400-e29b-41d4-a716-446655440029', labelEn: 'Thai', labelAr: 'تايلاندي', flag: '🇹🇭', staticCode: NationalityStaticCode.THAI },
        { id: '100e8400-e29b-41d4-a716-446655440030', labelEn: 'Vietnamese', labelAr: 'فيتنامي', flag: '🇻🇳', staticCode: NationalityStaticCode.VIETNAMESE },
        { id: '100e8400-e29b-41d4-a716-446655440031', labelEn: 'Kenyan', labelAr: 'كيني', flag: '🇰🇪', staticCode: NationalityStaticCode.KENYAN },
        { id: '100e8400-e29b-41d4-a716-446655440032', labelEn: 'Ugandan', labelAr: 'أوغندي', flag: '🇺🇬', staticCode: NationalityStaticCode.UGANDAN },
    ];

    console.log('Seeding Nationalities...');

    for (const item of data) {
        let entity = await repo.findOne({ where: { id: item.id } });
        if (!entity) {
            entity = repo.create(item);
        } else {
            Object.assign(entity, item);
        }
        await repo.save(entity);
    }
}
