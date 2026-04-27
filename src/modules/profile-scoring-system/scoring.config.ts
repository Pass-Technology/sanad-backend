import { ScoringSectionConfig, ScoringSectionId } from './interfaces/scoring-system.interfaces';

export const SCORING_CONFIG: ScoringSectionConfig[] = [
    {
        id: ScoringSectionId.BASIC_INFO,
        title: 'Basic Information',
        fields: [
            { key: 'tradeName', label: 'Trade Name', required: true, type: 'string' },
            { key: 'companyRepresentativeName', label: 'Company Representative Name', required: true, type: 'string' },
            { key: 'userInfo.fullName', label: 'User Full Name', required: true, type: 'string' },
            { key: 'userInfo.email', label: 'User Email', required: true, type: 'string' },
            { key: 'userInfo.mobileNumber', label: 'User Mobile Number', required: true, type: 'string' },
            { key: 'companyDescription', label: 'Company Description', required: false, type: 'string' },
            { key: 'websiteLink', label: 'Website Link', required: false, type: 'string' },
            { key: 'languages', label: 'Languages', required: true, type: 'array' },
        ],
    },
    {
        id: ScoringSectionId.LOCATION,
        title: 'Location & Coverage',
        fields: [
            { key: 'branches', label: 'Branch Locations', required: true, type: 'array' },
        ],
    },
    {
        id: ScoringSectionId.SERVICES,
        title: 'Services',
        fields: [
            { key: 'providerServices', label: 'Services Selection', required: true, type: 'array' },
        ],
    },
    {
        id: ScoringSectionId.COMPLIANCE,
        title: 'Compliance & Documents',
        fields: [
            {
                key: 'compliance.ownerIdFile',
                label: 'Owner ID Document',
                required: true,
                type: 'document',
                expiryKey: 'compliance.ownerIdExpiryDate'
            },
            {
                key: 'compliance.tradeLicenseFile',
                label: 'Trade License Document',
                required: true,
                type: 'document',
                expiryKey: 'compliance.tradeLicenseExpiryDate'
            },
        ],
    },
    {
        id: ScoringSectionId.PAYMENT,
        title: 'Payment Methods',
        fields: [
            {
                key: 'payment',
                label: 'Payment Configuration',
                required: true,
                type: 'at-least-one',
                keysToCheck: [
                    'payment.cash',
                    'payment.bankTransfer',
                    'payment.sanad',
                    'payment.pos',
                    'payment.cheque',
                    'payment.paymentLink',
                ],
            },
        ],
    },
];
