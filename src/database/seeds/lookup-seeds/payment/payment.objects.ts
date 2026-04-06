import { SettlementPreferenceStaticCode, POSProviderStaticCode, CardTypeStaticCode, PaymentLookupCategory } from "../../../../modules/lookups/enums/lookup-static-codes.enum";

export const paymentLookupObjects = [
    // Settlement Preferences
    { id: '11e0a1a1-3333-4444-8888-000000000001', labelEn: 'Weekly', labelAr: 'أسبوعياً', staticCode: SettlementPreferenceStaticCode.WEEKLY, category: PaymentLookupCategory.SETTLEMENT_PREFERENCE },
    { id: '11e0a1a1-3333-4444-8888-000000000002', labelEn: 'Monthly', labelAr: 'شهرياً', staticCode: SettlementPreferenceStaticCode.MONTHLY, category: PaymentLookupCategory.SETTLEMENT_PREFERENCE },

    // POS Providers
    { id: '22e0a1a1-2222-4444-8888-000000000001', labelEn: 'Paytab', labelAr: 'بيتاب', staticCode: POSProviderStaticCode.PAYTAB, category: PaymentLookupCategory.POS_PROVIDER },
    { id: '22e0a1a1-2222-4444-8888-000000000002', labelEn: 'Stripe', labelAr: 'سترايب', staticCode: POSProviderStaticCode.STRIPE, category: PaymentLookupCategory.POS_PROVIDER },

    // Supported Cards
    { id: '33e0a1a1-4444-4444-8888-000000000001', labelEn: 'Visa', labelAr: 'فيزا', staticCode: CardTypeStaticCode.VISA, category: PaymentLookupCategory.CARD_TYPE },
    { id: '33e0a1a1-4444-4444-8888-000000000002', labelEn: 'MasterCard', labelAr: 'ماستركارد', staticCode: CardTypeStaticCode.MASTERCARD, category: PaymentLookupCategory.CARD_TYPE },
    { id: '33e0a1a1-4444-4444-8888-000000000003', labelEn: 'American Express', labelAr: 'أمريكان إكسبريس', staticCode: CardTypeStaticCode.AMERICAN_EXPRESS, category: PaymentLookupCategory.CARD_TYPE },
    { id: '33e0a1a1-4444-4444-8888-000000000004', labelEn: 'Mada', labelAr: 'مدى', staticCode: CardTypeStaticCode.MADA, category: PaymentLookupCategory.CARD_TYPE },
];
