export interface ScoringFieldConfig {
    key: string;
    label: string;
    required: boolean;
    type: 'string' | 'number' | 'array' | 'document' | 'boolean' | 'at-least-one';
    expiryKey?: string;
    keysToCheck?: string[]; // Used for at-least-one type
}

export enum ScoringSectionId {
    BASIC_INFO = 'basicInfo',
    LOCATION = 'location',
    SERVICES = 'services',
    COMPLIANCE = 'compliance',
    PAYMENT = 'payment',
}

export interface ScoringSectionConfig {
    id: ScoringSectionId;
    title: string;
    fields: ScoringFieldConfig[];
}
