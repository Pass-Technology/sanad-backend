import { DataSource } from "typeorm";
import { PlanEntity } from "../../../modules/plan/entities/plan.entity";
import { LookUpProviderTypeEntity } from "../../../modules/profile/lookup-tables/entities/lookup-provider-type.entity";
import { ProviderTypeStaticCode } from "../../../modules/profile/lookup-tables/enums/lookup-static-codes.enum";

export const individualPlans = [
    {
        id: '11111111-0000-0000-0000-000000000001',
        nameEn: 'Starter',
        nameAr: 'مبتدئ',
        descriptionEn: 'Perfect for new providers',
        descriptionAr: 'مثالي للمزودين الجدد',
        tagEn: null,
        tagAr: null
    },
    {
        id: '22222222-0000-0000-0000-000000000002',
        nameEn: 'Professional',
        nameAr: 'محترف',
        descriptionEn: 'Popular for growing business',
        descriptionAr: 'شائع للأعمال المتنامية',
        tagEn: 'Most Popular',
        tagAr: 'الأكثر شعبية'
    },
    {
        id: '33333333-0000-0000-0000-000000000003',
        nameEn: 'Enterprise',
        nameAr: 'مؤسسة',
        descriptionEn: 'For large-scale operations',
        descriptionAr: 'للعمليات واسعة النطاق',
        tagEn: null,
        tagAr: null
    },
    {
        id: '44444444-0000-0000-0000-000000000004',
        nameEn: 'Customized Plan',
        nameAr: 'خطة مخصصة',
        descriptionEn: 'Reach out to our sales team for a tailored plan',
        descriptionAr: 'تواصل مع فريق المبيعات لدينا للحصول على خطة مخصصة',
        tagEn: null,
        tagAr: null
    }
];

export const companyPlans = [
    {
        id: '55555555-0000-0000-0000-000000000001',
        nameEn: 'Starter',
        nameAr: 'مبتدئ',
        descriptionEn: 'Perfect for small companies',
        descriptionAr: 'مثالي للشركات الصغيرة',
        tagEn: null,
        tagAr: null
    },
    {
        id: '66666666-0000-0000-0000-000000000002',
        nameEn: 'Professional',
        nameAr: 'محترف',
        descriptionEn: 'Popular for growing companies',
        descriptionAr: 'شائع للشركات المتنامية',
        tagEn: 'Most Popular',
        tagAr: 'الأكثر شعبية'
    },
    {
        id: '77777777-0000-0000-0000-000000000003',
        nameEn: 'Enterprise',
        nameAr: 'مؤسسة',
        descriptionEn: 'For corporate operations',
        descriptionAr: 'للعمليات المؤسسية',
        tagEn: null,
        tagAr: null
    },
    {
        id: '88888888-0000-0000-0000-000000000004',
        nameEn: 'Customized Plan',
        nameAr: 'خطة مخصصة',
        descriptionEn: 'Reach out for a corporate tailored plan',
        descriptionAr: 'تواصل للحصول على خطة مؤسسية مخصصة',
        tagEn: null,
        tagAr: null
    }
];

export async function planSeed(dataSource: DataSource) {
    const repo = dataSource.getRepository(PlanEntity);
    const ptRepo = dataSource.getRepository(LookUpProviderTypeEntity);

    const individual = await ptRepo.findOne({ where: { staticCode: ProviderTypeStaticCode.INDIVIDUAL } });
    const company = await ptRepo.findOne({ where: { staticCode: ProviderTypeStaticCode.COMPANY } });

    const seedSets = [
        { plans: individualPlans, type: individual },
        { plans: companyPlans, type: company }
    ];

    for (const set of seedSets) {
        if (!set.type) continue;
        for (const data of set.plans) {
            let entry = await repo.findOne({ where: { id: data.id } });
            if (entry) {
                Object.assign(entry, data);
                entry.providerType = set.type;
                await repo.save(entry);
            } else {
                const newPlan = repo.create({
                    ...data,
                    providerType: set.type
                });
                await repo.save(newPlan);
            }
        }
    }
}
