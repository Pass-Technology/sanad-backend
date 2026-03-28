import { DataSource } from "typeorm";
import { PlanFeatureEntity } from "../../../modules/plan/entities/plan-feature.entity";
import { individualPlans, companyPlans } from "./plan.seed";

export async function planFeatureSeed(dataSource: DataSource) {
    const repo = dataSource.getRepository(PlanFeatureEntity);

    const featureMetadata = {
        'f1': { nameEn: 'Bookings', nameAr: 'حجوزات', descriptionEn: 'Number of bookings per month', displayOrder: 1 },
        'f2': { nameEn: 'Basic analytics', nameAr: 'تحليلات أساسية', displayOrder: 2 },
        'f3': { nameEn: 'Custom analytics & reporting', nameAr: 'تحليلات وتقارير مخصصة', displayOrder: 3 },
        'f4': { nameEn: 'Advanced analytics & insights', nameAr: 'تحليلات ورؤى متقدمة', displayOrder: 4 },
        'f5': { nameEn: 'Email support', nameAr: 'دعم عبر البريد الإلكتروني', displayOrder: 5 },
        'f6': { nameEn: 'Priority support 24/7', nameAr: 'دعم ذو أولوية 24/7', displayOrder: 6 },
        'f7': { nameEn: 'Mobile app access', nameAr: 'الوصول عبر التطبيق', displayOrder: 7 },
        'f8': { nameEn: 'API access', nameAr: 'الوصول إلى API', displayOrder: 8 },
        'f9': { nameEn: 'Commission', nameAr: 'عمولة', displayOrder: 9 },
        'fa': { nameEn: 'White-label options', nameAr: 'خيار العلامة البيضاء', displayOrder: 10 },
        'fb': { nameEn: 'Premium placement', nameAr: 'مكان مميز', displayOrder: 11 },
        'fc': { nameEn: 'Featured listing', nameAr: 'قائمة مميزة', displayOrder: 12 },
        'fd': { nameEn: 'Marketing tools', nameAr: 'أدوات التسويق', displayOrder: 13 },
        'fe': { nameEn: 'Dedicated account manager', nameAr: 'مدير حساب مخصص', displayOrder: 14 },
    };

    const getPlanFeatures = (starterId: string, profId: string, entId: string) => [
        // Starter
        { planId: starterId, fKey: 'f1', vEn: 'Up to 50 bookings/month', vAr: 'حتى 50 حجز شهرياً' },
        { planId: starterId, fKey: 'f2', vEn: 'Basic analytics', vAr: 'تحليلات أساسية' },
        { planId: starterId, fKey: 'f5', vEn: 'Email support', vAr: 'دعم عبر البريد الإلكتروني' },
        { planId: starterId, fKey: 'f7', vEn: 'Mobile app access', vAr: 'الوصول عبر التطبيق' },
        { planId: starterId, fKey: 'f9', vEn: 'Standard commission: 12%', vAr: 'عمولة أساسية: 12%' },

        // Professional
        { planId: profId, fKey: 'f1', vEn: 'Up to 200 bookings/month', vAr: 'حتى 200 حجز شهرياً' },
        { planId: profId, fKey: 'f4', vEn: 'Advanced analytics & insights', vAr: 'تحليلات ورؤى متقدمة' },
        { planId: profId, fKey: 'f6', vEn: 'Priority support 24/7', vAr: 'دعم ذو أولوية 24/7' },
        { planId: profId, fKey: 'fd', vEn: 'Marketing tools', vAr: 'أدوات التسويق' },
        { planId: profId, fKey: 'f9', vEn: 'Reduced commission: 8%', vAr: 'عمولة مخفضة: 8%' },
        { planId: profId, fKey: 'fc', vEn: 'Featured listing', vAr: 'قائمة مميزة' },

        // Enterprise
        { planId: entId, fKey: 'f1', vEn: 'Unlimited bookings', vAr: 'حجز غير محدود' },
        { planId: entId, fKey: 'f3', vEn: 'Custom analytics & reporting', vAr: 'تحليلات وتقارير مخصصة' },
        { planId: entId, fKey: 'fe', vEn: 'Dedicated account manager', vAr: 'مدير حساب مخصص' },
        { planId: entId, fKey: 'f8', vEn: 'API access', vAr: 'الوصول إلى API' },
        { planId: entId, fKey: 'f9', vEn: 'Lowest commission: 5%', vAr: 'أقل عمولة: 5%' },
        { planId: entId, fKey: 'fb', vEn: 'Premium placement', vAr: 'مكان مميز' },
        { planId: entId, fKey: 'fa', vEn: 'White-label options', vAr: 'خيار العلامة البيضاء' },
    ];

    const allFeatures = [
        ...getPlanFeatures(individualPlans[0].id, individualPlans[1].id, individualPlans[2].id),
        ...getPlanFeatures(companyPlans[0].id, companyPlans[1].id, companyPlans[2].id)
    ];

    for (const data of allFeatures) {
        const meta = featureMetadata[data.fKey];
        const planId = data.planId;

        let entry = await repo.findOne({ 
            where: { 
                plan: { id: planId }, 
                nameEn: meta.nameEn 
            } 
        });

        const entityData = {
            ...meta,
            valueEn: data.vEn,
            valueAr: data.vAr,
            plan: { id: planId }
        };

        if (entry) {
            Object.assign(entry, entityData);
            await repo.save(entry);
        } else {
            await repo.save(repo.create(entityData));
        }
    }
}
