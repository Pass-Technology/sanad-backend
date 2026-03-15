import { DataSource } from "typeorm";
import { PlanEntity } from "src/modules/plan/entities/plan.entity";

export const plans = [
    {
        id: '11111111-0000-0000-0000-000000000001',
        nameEn: 'Starter',
        nameAr: 'Starter',
        descriptionEn: 'Perfect for new providers',
        descriptionAr: 'مثالي للمزودين الجدد',
        tagEn: null,
        tagAr: null
    },
    {
        id: '22222222-0000-0000-0000-000000000002',
        nameEn: 'Professional',
        nameAr: 'Professional',
        descriptionEn: 'Popular for growing business',
        descriptionAr: 'شائع للأعمال المتنامية',
        tagEn: 'Most Popular',
        tagAr: 'الأكثر شعبية'
    },
    {
        id: '33333333-0000-0000-0000-000000000003',
        nameEn: 'Enterprise',
        nameAr: 'Enterprise',
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

export async function planSeed(dataSource: DataSource) {
    const repo = dataSource.getRepository(PlanEntity);
    for (const data of plans) {
        let entry = await repo.findOne({ where: { id: data.id } });
        if (entry) {
            Object.assign(entry, data);
            await repo.save(entry);
        } else {
            await repo.save(repo.create(data));
        }
    }
}
