import { DataSource } from "typeorm";
import { FeatureEntity } from "src/modules/plan/entities/features.entity";

export const features = [
    { id: 'f1000000-0000-0000-0000-000000000001', nameEn: 'Bookings', nameAr: 'حجوزات', descriptionEn: 'Number of bookings per month' },
    { id: 'f2000000-0000-0000-0000-000000000002', nameEn: 'Basic analytics', nameAr: 'تحليلات أساسية' },
    { id: 'f3000000-0000-0000-0000-000000000003', nameEn: 'Custom analytics & reporting', nameAr: 'تحليلات وتقارير مخصصة' },
    { id: 'f4000000-0000-0000-0000-000000000004', nameEn: 'Advanced analytics & insights', nameAr: 'تحليلات ورؤى متقدمة' },
    { id: 'f5000000-0000-0000-0000-000000000005', nameEn: 'Email support', nameAr: 'دعم عبر البريد الإلكتروني' },
    { id: 'f6000000-0000-0000-0000-000000000006', nameEn: 'Priority support 24/7', nameAr: 'دعم ذو أولوية 24/7' },
    { id: 'f7000000-0000-0000-0000-000000000007', nameEn: 'Mobile app access', nameAr: 'الوصول عبر التطبيق' },
    { id: 'f8000000-0000-0000-0000-000000000008', nameEn: 'API access', nameAr: 'الوصول إلى API' },
    { id: 'f9000000-0000-0000-0000-000000000009', nameEn: 'Commission', nameAr: 'عمولة' },
    { id: 'fa000000-0000-0000-0000-000000000010', nameEn: 'White-label options', nameAr: 'خيار العلامة البيضاء' },
    { id: 'fb000000-0000-0000-0000-000000000011', nameEn: 'Premium placement', nameAr: 'مكان مميز' },
    { id: 'fc000000-0000-0000-0000-000000000012', nameEn: 'Featured listing', nameAr: 'قائمة مميزة' },
    { id: 'fd000000-0000-0000-0000-000000000013', nameEn: 'Marketing tools', nameAr: 'أدوات التسويق' },
    { id: 'fe000000-0000-0000-0000-000000000014', nameEn: 'Dedicated account manager', nameAr: 'مدير حساب مخصص' },
];

export async function featureSeed(dataSource: DataSource) {
    const repo = dataSource.getRepository(FeatureEntity);
    for (const data of features) {
        let entry = await repo.findOne({ where: { id: data.id } });
        if (entry) {
            Object.assign(entry, data);
            await repo.save(entry);
        } else {
            await repo.save(repo.create(data));
        }
    }
}
