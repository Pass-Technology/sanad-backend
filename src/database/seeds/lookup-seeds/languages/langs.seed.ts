import { DataSource } from "typeorm";
import { LookupLanguagesEntity } from "../../../../modules/lookups/entities/lookup-languages.entity";
import { LanguageStaticCode } from "src/modules/lookups/enums/lookup-static-codes.enum";

export async function langsSeed(dataSource: DataSource) {
    const langRepo = dataSource.getRepository(LookupLanguagesEntity);

    const langs = [
        { id: '000e8400-e29b-41d4-a716-446655440001', labelEn: 'English', labelAr: 'الإنجليزية', flag: '🇺🇸', staticCode: LanguageStaticCode.ENGLISH },
        { id: '000e8400-e29b-41d4-a716-446655440002', labelEn: 'Arabic', labelAr: 'العربية', flag: '🇦🇪', staticCode: LanguageStaticCode.ARABIC },
        { id: '000e8400-e29b-41d4-a716-446655440003', labelEn: 'Urdu', labelAr: 'أوردو', flag: '🇵🇰', staticCode: LanguageStaticCode.URDU },
        { id: '000e8400-e29b-41d4-a716-446655440004', labelEn: 'Hindi', labelAr: 'الهندية', flag: '🇮🇳', staticCode: LanguageStaticCode.HINDI },
        { id: '000e8400-e29b-41d4-a716-446655440005', labelEn: 'Tagalog', labelAr: 'الفليبنية', flag: '🇵🇭', staticCode: LanguageStaticCode.FILIPINO },

        { id: '000e8400-e29b-41d4-a716-446655440006', labelEn: 'French', labelAr: 'الفرنسية', flag: '🇫🇷', staticCode: LanguageStaticCode.FRENCH },
        { id: '000e8400-e29b-41d4-a716-446655440007', labelEn: 'Spanish', labelAr: 'الإسبانية', flag: '🇪🇸', staticCode: LanguageStaticCode.SPANISH },
        { id: '000e8400-e29b-41d4-a716-446655440008', labelEn: 'German', labelAr: 'الألمانية', flag: '🇩🇪', staticCode: LanguageStaticCode.GERMAN },
        { id: '000e8400-e29b-41d4-a716-446655440009', labelEn: 'Portuguese', labelAr: 'البرتغالية', flag: '🇵🇹', staticCode: LanguageStaticCode.PORTUGUESE },
        { id: '000e8400-e29b-41d4-a716-446655440010', labelEn: 'Chinese', labelAr: 'الصينية', flag: '🇨🇳', staticCode: LanguageStaticCode.CHINESE },
        { id: '000e8400-e29b-41d4-a716-446655440011', labelEn: 'Italian', labelAr: 'الإيطالية', flag: '🇮🇹', staticCode: LanguageStaticCode.ITALIAN },
        { id: '000e8400-e29b-41d4-a716-446655440012', labelEn: 'Russian', labelAr: 'الروسية', flag: '🇷🇺', staticCode: LanguageStaticCode.RUSSIAN },
        { id: '000e8400-e29b-41d4-a716-446655440013', labelEn: 'Japanese', labelAr: 'اليابانية', flag: '🇯🇵', staticCode: LanguageStaticCode.JAPANESE },
        { id: '000e8400-e29b-41d4-a716-446655440014', labelEn: 'Korean', labelAr: 'الكورية', flag: '🇰🇷', staticCode: LanguageStaticCode.KOREAN },
        { id: '000e8400-e29b-41d4-a716-446655440015', labelEn: 'Bengali', labelAr: 'البنغالية', flag: '🇧🇩', staticCode: LanguageStaticCode.BENGALI },
        { id: '000e8400-e29b-41d4-a716-446655440016', labelEn: 'Turkish', labelAr: 'التركية', flag: '🇹🇷', staticCode: LanguageStaticCode.TURKISH },
        { id: '000e8400-e29b-41d4-a716-446655440017', labelEn: 'Persian', labelAr: 'الفارسية', flag: '🇮🇷', staticCode: LanguageStaticCode.PERSIAN },
        { id: '000e8400-e29b-41d4-a716-446655440018', labelEn: 'Dutch', labelAr: 'الهولندية', flag: '🇳🇱', staticCode: LanguageStaticCode.DUTCH },
        { id: '000e8400-e29b-41d4-a716-446655440019', labelEn: 'Polish', labelAr: 'البولندية', flag: '🇵🇱', staticCode: LanguageStaticCode.POLISH },
        { id: '000e8400-e29b-41d4-a716-446655440020', labelEn: 'Swedish', labelAr: 'السويدية', flag: '🇸🇪', staticCode: LanguageStaticCode.SWEDISH },
        { id: '000e8400-e29b-41d4-a716-446655440021', labelEn: 'Danish', labelAr: 'الدنماركية', flag: '🇩🇰', staticCode: LanguageStaticCode.DANISH },
        { id: '000e8400-e29b-41d4-a716-446655440022', labelEn: 'Norwegian', labelAr: 'النرويجية', flag: '🇳🇴', staticCode: LanguageStaticCode.NORWEGIAN },
        { id: '000e8400-e29b-41d4-a716-446655440023', labelEn: 'Finnish', labelAr: 'الفنلندية', flag: '🇫🇮', staticCode: LanguageStaticCode.FINNISH },
        { id: '000e8400-e29b-41d4-a716-446655440024', labelEn: 'Greek', labelAr: 'اليونانية', flag: '🇬🇷', staticCode: LanguageStaticCode.GREEK },
        { id: '000e8400-e29b-41d4-a716-446655440025', labelEn: 'Thai', labelAr: 'التايلاندية', flag: '🇹🇭', staticCode: LanguageStaticCode.THAI },
        { id: '000e8400-e29b-41d4-a716-446655440026', labelEn: 'Vietnamese', labelAr: 'الفيتنامية', flag: '🇻🇳', staticCode: LanguageStaticCode.VIETNAMESE },
        { id: '000e8400-e29b-41d4-a716-446655440027', labelEn: 'Indonesian', labelAr: 'الإندونيسية', flag: '🇮🇩', staticCode: LanguageStaticCode.INDONESIAN },
        { id: '000e8400-e29b-41d4-a716-446655440028', labelEn: 'Malay', labelAr: 'الماليزية', flag: '🇲🇾', staticCode: LanguageStaticCode.MALAY },
        { id: '000e8400-e29b-41d4-a716-446655440029', labelEn: 'Swahili', labelAr: 'السواحيلية', flag: '🇰🇪', staticCode: LanguageStaticCode.SWAHILI },
        { id: '000e8400-e29b-41d4-a716-446655440030', labelEn: 'Hebrew', labelAr: 'العبرية', flag: '🇮🇱', staticCode: LanguageStaticCode.HEBREW },
        { id: '000e8400-e29b-41d4-a716-446655440031', labelEn: 'Ukrainian', labelAr: 'الأوكرانية', flag: '🇺🇦', staticCode: LanguageStaticCode.UKRAINIAN },
        { id: '000e8400-e29b-41d4-a716-446655440032', labelEn: 'Romanian', labelAr: 'الرومانية', flag: '🇷🇴', staticCode: LanguageStaticCode.ROMANIAN },
        { id: '000e8400-e29b-41d4-a716-446655440033', labelEn: 'Hungarian', labelAr: 'المجرية', flag: '🇭🇺', staticCode: LanguageStaticCode.HUNGARIAN },
        { id: '000e8400-e29b-41d4-a716-446655440034', labelEn: 'Czech', labelAr: 'التشيكية', flag: '🇨🇿', staticCode: LanguageStaticCode.CZECH },
        { id: '000e8400-e29b-41d4-a716-446655440035', labelEn: 'Slovak', labelAr: 'السلوفاكية', flag: '🇸🇰', staticCode: LanguageStaticCode.SLOVAK },
        { id: '000e8400-e29b-41d4-a716-446655440036', labelEn: 'Bulgarian', labelAr: 'البلغارية', flag: '🇧🇬', staticCode: LanguageStaticCode.BULGARIAN },
        { id: '000e8400-e29b-41d4-a716-446655440037', labelEn: 'Croatian', labelAr: 'الكرواتية', flag: '🇭🇷', staticCode: LanguageStaticCode.CROATIAN },
        { id: '000e8400-e29b-41d4-a716-446655440038', labelEn: 'Serbian', labelAr: 'الصربية', flag: '🇷🇸', staticCode: LanguageStaticCode.SERBIAN },
        { id: '000e8400-e29b-41d4-a716-446655440039', labelEn: 'Amharic', labelAr: 'الأمهرية', flag: '🇪🇹', staticCode: LanguageStaticCode.AMHARIC },
        { id: '000e8400-e29b-41d4-a716-446655440040', labelEn: 'Pashto', labelAr: 'البشتو', flag: '🇦🇫', staticCode: LanguageStaticCode.PASHTO },
        { id: '000e8400-e29b-41d4-a716-446655440041', labelEn: 'Kurdish', labelAr: 'الكردية', flag: '🇮🇶', staticCode: LanguageStaticCode.KURDISH },
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