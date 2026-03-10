export const ProviderType = {
    INDIVIDUAL: 'individual',
    COMPANY: 'company'
} as const;

export const providerTypeSeed = [
    { id: ProviderType.INDIVIDUAL, label: 'Individual' },
    { id: ProviderType.COMPANY, label: 'Company' },
];