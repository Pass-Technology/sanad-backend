export const CompanyType = {
    PRIVATE: 'private',
    GOVERNMENT: 'government',
    SEMI_GOVERNMENT: 'semi-government'
} as const;

export const companyTypeSeed = [
    { id: CompanyType.PRIVATE, labelEn: 'Private', labelAr: 'خاص' },
    { id: CompanyType.GOVERNMENT, labelEn: 'Government', labelAr: 'حكومي' },
    { id: CompanyType.SEMI_GOVERNMENT, labelEn: 'Semi-Government', labelAr: 'شبه حكومي' },
];