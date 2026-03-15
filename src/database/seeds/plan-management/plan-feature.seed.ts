import { DataSource } from "typeorm";
import { PlanFeatureEntity } from "src/modules/plan/entities/plan-feature.entity";

export async function planFeatureSeed(dataSource: DataSource) {
    const repo = dataSource.getRepository(PlanFeatureEntity);
    
    const starterId = '11111111-0000-0000-0000-000000000001';
    const profId = '22222222-0000-0000-0000-000000000002';
    const entId = '33333333-0000-0000-0000-000000000003';

    const planFeatures = [
        // Starter
        { plan: { id: starterId }, feature: { id: 'f1000000-0000-0000-0000-000000000001' }, value: 'Up to 50 bookings/month' },
        { plan: { id: starterId }, feature: { id: 'f2000000-0000-0000-0000-000000000002' }, value: 'Basic analytics' },
        { plan: { id: starterId }, feature: { id: 'f5000000-0000-0000-0000-000000000005' }, value: 'Email support' },
        { plan: { id: starterId }, feature: { id: 'f7000000-0000-0000-0000-000000000007' }, value: 'Mobile app access' },
        { plan: { id: starterId }, feature: { id: 'f9000000-0000-0000-0000-000000000009' }, value: 'Standard commission: 12%' },

        // Professional
        { plan: { id: profId }, feature: { id: 'f1000000-0000-0000-0000-000000000001' }, value: 'Up to 200 bookings/month' },
        { plan: { id: profId }, feature: { id: 'f4000000-0000-0000-0000-000000000004' }, value: 'Advanced analytics & insights' },
        { plan: { id: profId }, feature: { id: 'f6000000-0000-0000-0000-000000000006' }, value: 'Priority support 24/7' },
        { plan: { id: profId }, feature: { id: 'fd000000-0000-0000-0000-000000000013' }, value: 'Marketing tools' },
        { plan: { id: profId }, feature: { id: 'f9000000-0000-0000-0000-000000000009' }, value: 'Reduced commission: 8%' },
        { plan: { id: profId }, feature: { id: 'fc000000-0000-0000-0000-000000000012' }, value: 'Featured listing' },

        // Enterprise
        { plan: { id: entId }, feature: { id: 'f1000000-0000-0000-0000-000000000001' }, value: 'Unlimited bookings' },
        { plan: { id: entId }, feature: { id: 'f3000000-0000-0000-0000-000000000003' }, value: 'Custom analytics & reporting' },
        { plan: { id: entId }, feature: { id: 'fe000000-0000-0000-0000-000000000014' }, value: 'Dedicated account manager' },
        { plan: { id: entId }, feature: { id: 'f8000000-0000-0000-0000-000000000008' }, value: 'API access' },
        { plan: { id: entId }, feature: { id: 'f9000000-0000-0000-0000-000000000009' }, value: 'Lowest commission: 5%' },
        { plan: { id: entId }, feature: { id: 'fb000000-0000-0000-0000-000000000011' }, value: 'Premium placement' },
        { plan: { id: entId }, feature: { id: 'fa000000-0000-0000-0000-000000000010' }, value: 'White-label options' },
    ];

    for (const pf of planFeatures) {
        let entry = await repo.findOne({ 
            where: { 
                plan: { id: pf.plan.id }, 
                feature: { id: pf.feature.id } 
            } 
        });
        if (entry) {
            entry.value = pf.value;
            await repo.save(entry);
        } else {
            await repo.save(repo.create(pf));
        }
    }

}
