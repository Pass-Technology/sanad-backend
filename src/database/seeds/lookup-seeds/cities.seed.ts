import { LookupCityEntity } from "src/modules/lookups/entities/lookup-city.entity";
import { CityStaticCode } from "src/modules/lookups/enums/lookup-static-codes.enum";
import { DataSource } from "typeorm";


export async function citiesSeed(dataSource: DataSource) {
    const repo = dataSource.getRepository(LookupCityEntity);

    const data = [
        { id: '200e8400-e29b-41d4-a716-446655440001', labelEn: 'Abu Dhabi', labelAr: 'أبوظبي', staticCode: CityStaticCode.ABU_DHABI },
        { id: '200e8400-e29b-41d4-a716-446655440002', labelEn: 'Dubai', labelAr: 'دبي', staticCode: CityStaticCode.DUBAI },
        { id: '200e8400-e29b-41d4-a716-446655440003', labelEn: 'Sharjah', labelAr: 'الشارقة', staticCode: CityStaticCode.SHARJAH },
        { id: '200e8400-e29b-41d4-a716-446655440004', labelEn: 'Al Ain', labelAr: 'العين', staticCode: CityStaticCode.AL_AIN },
        { id: '200e8400-e29b-41d4-a716-446655440005', labelEn: 'Ajman', labelAr: 'عجمان', staticCode: CityStaticCode.AJMAN },
        { id: '200e8400-e29b-41d4-a716-446655440006', labelEn: 'Ras Al Khaimah', labelAr: 'رأس الخيمة', staticCode: CityStaticCode.RAS_AL_KHAIMAH },
        { id: '200e8400-e29b-41d4-a716-446655440007', labelEn: 'Fujairah', labelAr: 'الفجيرة', staticCode: CityStaticCode.FUJAIRAH },
        { id: '200e8400-e29b-41d4-a716-446655440008', labelEn: 'Umm Al Quwain', labelAr: 'أم القيوين', staticCode: CityStaticCode.UMM_AL_QUWAIN },
        { id: '200e8400-e29b-41d4-a716-446655440009', labelEn: 'Kalba', labelAr: 'كلباء', staticCode: CityStaticCode.KALBA },
        { id: '200e8400-e29b-41d4-a716-446655440010', labelEn: 'Dibba Al Fujairah', labelAr: 'دبا الفجيرة', staticCode: CityStaticCode.DIBBA_AL_FUJAIRAH },
        { id: '200e8400-e29b-41d4-a716-446655440011', labelEn: 'Madinat Zayed', labelAr: 'مدينة زايد', staticCode: CityStaticCode.MADINAT_ZAYED },
        { id: '200e8400-e29b-41d4-a716-446655440012', labelEn: 'Khor Fakkan', labelAr: 'خورفكان', staticCode: CityStaticCode.KHOR_FAKKAN },
        { id: '200e8400-e29b-41d4-a716-446655440013', labelEn: 'Al Dhannah', labelAr: 'الرويس', staticCode: CityStaticCode.AL_DHANNAH },
        { id: '200e8400-e29b-41d4-a716-446655440014', labelEn: 'Ghayathi', labelAr: 'غياثي', staticCode: CityStaticCode.GHAYATHI },
        { id: '200e8400-e29b-41d4-a716-446655440015', labelEn: 'Dhaid', labelAr: 'الذيد', staticCode: CityStaticCode.DHAID },
        { id: '200e8400-e29b-41d4-a716-446655440016', labelEn: 'Jebel Ali', labelAr: 'جبل علي', staticCode: CityStaticCode.JEBEL_ALI },
        { id: '200e8400-e29b-41d4-a716-446655440017', labelEn: 'Liwa Oasis', labelAr: 'واحة ليوا', staticCode: CityStaticCode.LIWA_OASIS },
        { id: '200e8400-e29b-41d4-a716-446655440018', labelEn: 'Hatta', labelAr: 'حتا', staticCode: CityStaticCode.HATTA },
        { id: '200e8400-e29b-41d4-a716-446655440019', labelEn: 'Ar Rams', labelAr: 'الرمس', staticCode: CityStaticCode.AR_RAMS },
        { id: '200e8400-e29b-41d4-a716-446655440020', labelEn: 'Dibba Al Hisn', labelAr: 'دبا الحصن', staticCode: CityStaticCode.DIBBA_AL_HISN },
        { id: '200e8400-e29b-41d4-a716-446655440021', labelEn: 'Al Jazirah Al Hamra', labelAr: 'الجزيرة الحمراء', staticCode: CityStaticCode.AL_JAZIRAH_AL_HAMRA },
        { id: '200e8400-e29b-41d4-a716-446655440022', labelEn: 'Masafi', labelAr: 'مسافي', staticCode: CityStaticCode.MASAFI },
        { id: '200e8400-e29b-41d4-a716-446655440023', labelEn: 'Mirbah', labelAr: 'مربح', staticCode: CityStaticCode.MIRBAH },
        { id: '200e8400-e29b-41d4-a716-446655440024', labelEn: 'Masfout', labelAr: 'مصفوت', staticCode: CityStaticCode.MASFOUT },
        { id: '200e8400-e29b-41d4-a716-446655440025', labelEn: 'Falaj Al Mualla', labelAr: 'فلج المعلا', staticCode: CityStaticCode.FALAJ_AL_MUALLA },
        { id: '200e8400-e29b-41d4-a716-446655440026', labelEn: 'Al Madam', labelAr: 'المدام', staticCode: CityStaticCode.AL_MADAM },
        { id: '200e8400-e29b-41d4-a716-446655440027', labelEn: 'Sweihan', labelAr: 'سويحان', staticCode: CityStaticCode.SWEIHAN },
        { id: '200e8400-e29b-41d4-a716-446655440028', labelEn: 'Sila', labelAr: 'السلع', staticCode: CityStaticCode.SILA },
        { id: '200e8400-e29b-41d4-a716-446655440029', labelEn: 'Al Mirfa', labelAr: 'المرفأ', staticCode: CityStaticCode.AL_MIRFA },
        { id: '200e8400-e29b-41d4-a716-446655440030', labelEn: 'Delma', labelAr: 'دلما', staticCode: CityStaticCode.DELMA },
        { id: '200e8400-e29b-41d4-a716-446655440031', labelEn: 'Ghantoot', labelAr: 'غنتوت', staticCode: CityStaticCode.GHANTOOT },
        { id: '200e8400-e29b-41d4-a716-446655440032', labelEn: 'Al Shamkhah', labelAr: 'الشامخة', staticCode: CityStaticCode.AL_SHAMKHAH },
        { id: '200e8400-e29b-41d4-a716-446655440033', labelEn: 'Bani Yas', labelAr: 'بني ياس', staticCode: CityStaticCode.BANI_YAS },
        { id: '200e8400-e29b-41d4-a716-446655440034', labelEn: 'Musaffah', labelAr: 'مصفح', staticCode: CityStaticCode.MUSAFFAH },
        { id: '200e8400-e29b-41d4-a716-446655440035', labelEn: 'Mohammed Bin Zayed City', labelAr: 'مدينة محمد بن زايد', staticCode: CityStaticCode.MOHAMMED_BIN_ZAYED_CITY },
        { id: '200e8400-e29b-41d4-a716-446655440036', labelEn: 'Khalifa City', labelAr: 'مدينة خليفة', staticCode: CityStaticCode.KHALIFA_CITY },
        { id: '200e8400-e29b-41d4-a716-446655440037', labelEn: 'Shahama', labelAr: 'الشهامة', staticCode: CityStaticCode.SHAHAMA },
        { id: '200e8400-e29b-41d4-a716-446655440038', labelEn: 'Rahba', labelAr: 'الرحبة', staticCode: CityStaticCode.RAHBA },
        { id: '200e8400-e29b-41d4-a716-446655440039', labelEn: 'Digdaga', labelAr: 'دقداقة', staticCode: CityStaticCode.DIGDAGA },
        { id: '200e8400-e29b-41d4-a716-446655440040', labelEn: 'Shawkah', labelAr: 'شوكة', staticCode: CityStaticCode.SHAWKAH },
        { id: '200e8400-e29b-41d4-a716-446655440041', labelEn: 'Khatt', labelAr: 'خت', staticCode: CityStaticCode.KHATT },
        { id: '200e8400-e29b-41d4-a716-446655440042', labelEn: 'Manama', labelAr: 'المنامة', staticCode: CityStaticCode.MANAMA },
        { id: '200e8400-e29b-41d4-a716-446655440043', labelEn: 'Jebel Dhanna', labelAr: 'جبل الظنة', staticCode: CityStaticCode.JEBEL_DHANNA },
        { id: '200e8400-e29b-41d4-a716-446655440044', labelEn: 'Dadna', labelAr: 'ضدنا', staticCode: CityStaticCode.DADNA },
        { id: '200e8400-e29b-41d4-a716-446655440045', labelEn: 'Qidfa', labelAr: 'قدفع', staticCode: CityStaticCode.QIDFA },
        { id: '200e8400-e29b-41d4-a716-446655440046', labelEn: 'Al Tayyebah', labelAr: 'الطيبة', staticCode: CityStaticCode.AL_TAYYEBAH },
        { id: '200e8400-e29b-41d4-a716-446655440047', labelEn: 'Qurayyah', labelAr: 'القرية', staticCode: CityStaticCode.QURAYYAH },
        { id: '200e8400-e29b-41d4-a716-446655440048', labelEn: 'Siji', labelAr: 'سيجي', staticCode: CityStaticCode.SIJI },
        { id: '200e8400-e29b-41d4-a716-446655440049', labelEn: 'Al Bithnah', labelAr: 'البثنة', staticCode: CityStaticCode.AL_BITHNAH },
        { id: '200e8400-e29b-41d4-a716-446655440050', labelEn: 'Shaam', labelAr: 'شعم', staticCode: CityStaticCode.SHAAM },
        { id: '200e8400-e29b-41d4-a716-446655440051', labelEn: 'Al Hamriyah', labelAr: 'الحمرية', staticCode: CityStaticCode.AL_HAMRIYAH },
        { id: '200e8400-e29b-41d4-a716-446655440052', labelEn: 'Mleiha', labelAr: 'مليحة', staticCode: CityStaticCode.MLEIHA },
        { id: '200e8400-e29b-41d4-a716-446655440053', labelEn: 'Al Raas', labelAr: 'الراس', staticCode: CityStaticCode.AL_RAAS },
        { id: '200e8400-e29b-41d4-a716-446655440054', labelEn: 'Al Sinniyah', labelAr: 'السينية', staticCode: CityStaticCode.AL_SINNIYAH },
        { id: '200e8400-e29b-41d4-a716-446655440055', labelEn: 'Ghayl', labelAr: 'غيل', staticCode: CityStaticCode.GHAYL },
        { id: '200e8400-e29b-41d4-a716-446655440056', labelEn: 'Al Jeer', labelAr: 'الجير', staticCode: CityStaticCode.AL_JEER },
        { id: '200e8400-e29b-41d4-a716-446655440057', labelEn: 'Al Faqa', labelAr: 'الفقع', staticCode: CityStaticCode.AL_FAQA },
        { id: '200e8400-e29b-41d4-a716-446655440058', labelEn: 'Al Wagan', labelAr: 'الوقن', staticCode: CityStaticCode.AL_WAGAN },
        { id: '200e8400-e29b-41d4-a716-446655440059', labelEn: 'Al Qua', labelAr: 'القوع', staticCode: CityStaticCode.AL_QUA },
        { id: '200e8400-e29b-41d4-a716-446655440060', labelEn: 'Al Marfa', labelAr: 'المرفأ', staticCode: CityStaticCode.AL_MARFA },
        { id: '200e8400-e29b-41d4-a716-446655440061', labelEn: 'Al Rafaah', labelAr: 'الرفاعة', staticCode: CityStaticCode.AL_RAFAAH },
        { id: '200e8400-e29b-41d4-a716-446655440062', labelEn: 'Al Aamerah', labelAr: 'العامرة', staticCode: CityStaticCode.AL_AAMERAH },
        { id: '200e8400-e29b-41d4-a716-446655440063', labelEn: 'Khor Khuwair', labelAr: 'خور خوير', staticCode: CityStaticCode.KHOR_KHUWAIR },
        { id: '200e8400-e29b-41d4-a716-446655440064', labelEn: 'Adhen', labelAr: 'اذن', staticCode: CityStaticCode.ADHEN },
        { id: '200e8400-e29b-41d4-a716-446655440065', labelEn: 'Habshan', labelAr: 'حبشان', staticCode: CityStaticCode.HABSHAN },
        { id: '200e8400-e29b-41d4-a716-446655440066', labelEn: 'Asab', labelAr: 'عصب', staticCode: CityStaticCode.ASAB },
        { id: '200e8400-e29b-41d4-a716-446655440067', labelEn: 'Tarif', labelAr: 'طريف', staticCode: CityStaticCode.TARIF },
        { id: '200e8400-e29b-41d4-a716-446655440068', labelEn: 'Al Fayah', labelAr: 'الفاية', staticCode: CityStaticCode.AL_FAYAH },
        { id: '200e8400-e29b-41d4-a716-446655440069', labelEn: 'Al Aryam', labelAr: 'الأريام', staticCode: CityStaticCode.AL_ARYAM },
        { id: '200e8400-e29b-41d4-a716-446655440070', labelEn: 'Al Jurf', labelAr: 'الجرف', staticCode: CityStaticCode.AL_JURF },
        { id: '200e8400-e29b-41d4-a716-446655440071', labelEn: 'Al Samha', labelAr: 'السمحة', staticCode: CityStaticCode.AL_SAMHA },
        { id: '200e8400-e29b-41d4-a716-446655440072', labelEn: 'Al Bahyah', labelAr: 'الباهية', staticCode: CityStaticCode.AL_BAHYAH },
        { id: '200e8400-e29b-41d4-a716-446655440073', labelEn: 'Al Khatim', labelAr: 'الختم', staticCode: CityStaticCode.AL_KHATIM },
        { id: '200e8400-e29b-41d4-a716-446655440074', labelEn: 'Al Taweelah', labelAr: 'الطويلة', staticCode: CityStaticCode.AL_TAWEELAH },
    ];

    console.log('Seeding UAE Cities...');

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
