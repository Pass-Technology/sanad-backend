
export interface ScoringFieldConfig {
    key: string;
    label: string;
    required: boolean;
    type: 'string' | 'number' | 'array' | 'document' | 'boolean';
    expiryKey?: string;
}

export interface ScoringSectionConfig {
    id: string;
    title: string;
    fields: ScoringFieldConfig[];
}

export const SCORING_CONFIG: ScoringSectionConfig[] = [
    {
        id: 'basicInfo',
        title: 'Basic Information',
        fields: [
            { key: 'userInfo.fullName', label: 'Full Name', required: true, type: 'string' },
            { key: 'userInfo.email', label: 'Email', required: true, type: 'string' },
            { key: 'userInfo.mobileNumber', label: 'Mobile Number', required: true, type: 'string' },
            { key: 'userInfo.nationalId', label: 'National ID', required: true, type: 'string' },
            { key: 'userInfo.dateOfBirth', label: 'Date of Birth', required: true, type: 'string' },
            { key: 'tradeName', label: 'Trade Name', required: true, type: 'string' },
            { key: 'providerType', label: 'Provider Type', required: true, type: 'string' },
            { key: 'companyDescription', label: 'Company Description', required: false, type: 'string' },
            { key: 'websiteLink', label: 'Website Link', required: false, type: 'string' },
            { key: 'socialMediaLink', label: 'Social Media Link', required: false, type: 'string' },
            { key: 'languages', label: 'Languages', required: true, type: 'array' },
        ],
    },
    {
        id: 'location',
        title: 'Location & Coverage',
        fields: [
            { key: 'branches', label: 'Branches', required: true, type: 'array' },
            // we can add more for branches if we want
        ],
    },
    {
        id: 'services',
        title: 'Services',
        fields: [
            { key: 'selectedServices', label: 'Selected Services', required: true, type: 'array' },
        ],
    },
    {
        id: 'compliance',
        title: 'Compliance & Documents',
        fields: [
            {
                key: 'compliance.ownerIdFile',
                label: 'Owner ID File',
                required: true,
                type: 'document',
                expiryKey: 'compliance.ownerIdExpiryDate'
            },
            {
                key: 'compliance.tradeLicenseFile',
                label: 'Trade License File',
                required: true,
                type: 'document',
                expiryKey: 'compliance.tradeLicenseExpiryDate'
            },
        ],
    },
];
