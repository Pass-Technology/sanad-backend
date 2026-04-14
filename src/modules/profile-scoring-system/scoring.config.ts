import { ScoringSectionConfig, ScoringSectionId } from './interfaces/scoring-system.interfaces';

export const SCORING_CONFIG: ScoringSectionConfig[] = [
    {
        id: ScoringSectionId.BASIC_INFO,
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
        id: ScoringSectionId.LOCATION,
        title: 'Location & Coverage',
        fields: [
            { key: 'branches', label: 'Branches', required: true, type: 'array' },
            // we can add more for branches if we want
        ],
    },
    {
        id: ScoringSectionId.SERVICES,
        title: 'Services',
        fields: [
            { key: 'selectedServices', label: 'Selected Services', required: true, type: 'array' },
        ],
    },
    {
        id: ScoringSectionId.COMPLIANCE,
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
