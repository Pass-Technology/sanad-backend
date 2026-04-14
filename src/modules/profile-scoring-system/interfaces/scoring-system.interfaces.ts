export interface ScoringFieldConfig {
    key: string;
    label: string;
    required: boolean;
    type: 'string' | 'number' | 'array' | 'document' | 'boolean';
    expiryKey?: string;
}

export enum ScoringSectionId {
    BASIC_INFO = 'basicInfo',
    LOCATION = 'location',
    SERVICES = 'services',
    COMPLIANCE = 'compliance',
}

export interface ScoringSectionConfig {
    id: ScoringSectionId;
    title: string;
    fields: ScoringFieldConfig[];
}
