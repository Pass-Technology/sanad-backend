export const ProviderType = {
    INDIVIDUAL: 'individual',
    COMPANY: 'company'
} as const;

export const providerTypeSeed = [
    { id: ProviderType.INDIVIDUAL, labelEn: 'Individual', labelAr: 'فرد' },
    { id: ProviderType.COMPANY, labelEn: 'Company', labelAr: 'شركة' },
];