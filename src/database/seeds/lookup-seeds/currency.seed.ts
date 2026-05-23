import { DataSource } from 'typeorm';
import { LookupCurrencyEntity } from '../../../modules/lookups/entities/lookup-currency.entity';
import { CurrencyStaticCode } from '../../../modules/lookups/enums/lookup-static-codes.enum';

export async function currencySeed(dataSource: DataSource) {
    const repository = dataSource.getRepository(LookupCurrencyEntity);

    const currencies = [
        { id: '300e8400-e29b-41d4-a716-446655440001', labelEn: 'UAE Dirham', labelAr: 'درهم إماراتي', staticCode: CurrencyStaticCode.AED, symbol: 'د.إ', emoji: '🇦🇪' },
        { id: '300e8400-e29b-41d4-a716-446655440002', labelEn: 'US Dollar', labelAr: 'دولار أمريكي', staticCode: CurrencyStaticCode.USD, symbol: '$', emoji: '🇺🇸' },
        { id: '300e8400-e29b-41d4-a716-446655440003', labelEn: 'Saudi Riyal', labelAr: 'ريال سعودي', staticCode: CurrencyStaticCode.SAR, symbol: 'ر.س', emoji: '🇸🇦' },
        { id: '300e8400-e29b-41d4-a716-446655440004', labelEn: 'Euro', labelAr: 'يورو', staticCode: CurrencyStaticCode.EUR, symbol: '€', emoji: '🇪🇺' },
    ];

    console.log('Seeding Currencies...');

    for (const item of currencies) {
        let entity = await repository.findOne({ where: { id: item.id } });
        if (!entity) {
            entity = repository.create(item);
        } else {
            Object.assign(entity, item);
        }
        await repository.save(entity);
    }
}
