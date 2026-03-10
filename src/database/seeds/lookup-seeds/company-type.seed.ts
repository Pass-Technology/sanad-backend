export const CompanyType = {
    PRIVATE: 'private',
    GOVERNMENT: 'government',
    SEMI_GOVERNMENT: 'semi-government'
} as const;

export const companyTypeSeed = [
    { id: CompanyType.PRIVATE, label: 'Private' },
    { id: CompanyType.GOVERNMENT, label: 'Government' },
    { id: CompanyType.SEMI_GOVERNMENT, label: 'Semi-Government' },
];