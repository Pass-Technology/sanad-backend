export const profileStatusSeed = [
    { id: 'draft', label: 'Draft' },
    { id: 'pending_review', label: 'Pending Review' },
    { id: 'approved', label: 'Approved' },
    { id: 'rejected', label: 'Rejected' }
];


export const ProviderType = {
    INDIVIDUAL: 'individual',
    COMPANY: 'company'
} as const;

export const providerTypeSeed = [
    { id: ProviderType.INDIVIDUAL, label: 'Individual' },
    { id: ProviderType.COMPANY, label: 'Company' },
];

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

export const billingCycleSeed = [
    { id: 'monthly', label: 'Monthly' },
    { id: '3months', label: '3 Months' },
    { id: '6months', label: '6 Months' },
    { id: 'yearly', label: 'Yearly' },

]

