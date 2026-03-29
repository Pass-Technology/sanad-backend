import { DataSource } from "typeorm";
import { LookupLanguagesEntity } from "../../../../modules/profile/lookup-tables/entities/lookup-languages.entity";
import { LanguageStaticCode } from "src/modules/profile/lookup-tables/enums/lookup-static-codes.enum";

export async function langsSeed(dataSource: DataSource) {
    const langRepo = dataSource.getRepository(LookupLanguagesEntity);

    const langs = [
        { id: '000e8400-e29b-41d4-a716-446655440001', labelEn: 'English', labelAr: 'الإنجليزية', flag: '🇺🇸', staticCode: LanguageStaticCode.ENGLISH },
        { id: '000e8400-e29b-41d4-a716-446655440002', labelEn: 'Arabic', labelAr: 'العربية', flag: '🇦🇪', staticCode: LanguageStaticCode.ARABIC },
        { id: '000e8400-e29b-41d4-a716-446655440003', labelEn: 'Urdu', labelAr: 'أوردو', flag: '🇵🇰', staticCode: LanguageStaticCode.URDU },
        { id: '000e8400-e29b-41d4-a716-446655440004', labelEn: 'Hindi', labelAr: 'الهندية', flag: '🇮🇳', staticCode: LanguageStaticCode.HINDI },
        { id: '000e8400-e29b-41d4-a716-446655440005', labelEn: 'Tagalog', labelAr: 'التاغالوغية', flag: '🇵🇭', staticCode: LanguageStaticCode.TAGALOG },
    ];

    console.log('Seeding Languages...');

    for (const lang of langs) {
        let langEntity = await langRepo.findOne({ where: { id: lang.id } });
        if (!langEntity) {
            langEntity = langRepo.create(lang);
            await langRepo.save(langEntity);
        } else {
            langEntity.labelEn = lang.labelEn;
            langEntity.labelAr = lang.labelAr;
            langEntity.flag = lang.flag;
            langEntity.staticCode = lang.staticCode;
            await langRepo.save(langEntity);
        }
    }
}