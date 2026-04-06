import { SettlementPreferenceStaticCode, POSProviderStaticCode, CardTypeStaticCode, PaymentLookupCategory } from "../../../../modules/lookups/enums/lookup-static-codes.enum";

export const paymentLookupCategories = [
    { id: 'c1110000-0000-0000-0000-000000000001', labelEn: 'Settlement Preference', labelAr: 'تفضيلات التسوية', staticCode: PaymentLookupCategory.SETTLEMENT_PREFERENCE },
    { id: 'c1110000-0000-0000-0000-000000000002', labelEn: 'POS Provider', labelAr: 'مزود خدمة نقاط البيع', staticCode: PaymentLookupCategory.POS_PROVIDER },
    { id: 'c1110000-0000-0000-0000-000000000003', labelEn: 'Supported Cards', labelAr: 'البطاقات المدعومة', staticCode: PaymentLookupCategory.CARD_TYPE },
];

export const paymentLookupObjects = [
    // Settlement Preferences
    { id: '11e0a1a1-3333-4444-8888-000000000001', labelEn: 'Weekly', labelAr: 'أسبوعياً', staticCode: SettlementPreferenceStaticCode.WEEKLY, categoryId: 'c1110000-0000-0000-0000-000000000001' },
    { id: '11e0a1a1-3333-4444-8888-000000000002', labelEn: 'Monthly', labelAr: 'شهرياً', staticCode: SettlementPreferenceStaticCode.MONTHLY, categoryId: 'c1110000-0000-0000-0000-000000000001' },

    // POS Providers
    { id: '22e0a1a1-2222-4444-8888-000000000001', labelEn: 'Paytab', labelAr: 'بيتاب', staticCode: POSProviderStaticCode.PAYTAB, categoryId: 'c1110000-0000-0000-0000-000000000002' },
    { id: '22e0a1a1-2222-4444-8888-000000000002', labelEn: 'Stripe', labelAr: 'سترايب', staticCode: POSProviderStaticCode.STRIPE, categoryId: 'c1110000-0000-0000-0000-000000000002' },

    // Supported Cards
    { id: '33e0a1a1-4444-4444-8888-000000000001', labelEn: 'Visa', labelAr: 'فيزا', staticCode: CardTypeStaticCode.VISA, categoryId: 'c1110000-0000-0000-0000-000000000003' },
    { id: '33e0a1a1-4444-4444-8888-000000000002', labelEn: 'MasterCard', labelAr: 'ماستركارد', staticCode: CardTypeStaticCode.MASTERCARD, categoryId: 'c1110000-0000-0000-0000-000000000003' },
    { id: '33e0a1a1-4444-4444-8888-000000000003', labelEn: 'American Express', labelAr: 'أمريكان إكسبريس', staticCode: CardTypeStaticCode.AMERICAN_EXPRESS, categoryId: 'c1110000-0000-0000-0000-000000000003' },
    { id: '33e0a1a1-4444-4444-8888-000000000004', labelEn: 'Mada', labelAr: 'مدى', staticCode: CardTypeStaticCode.MADA, categoryId: 'c1110000-0000-0000-0000-000000000003' },
];
