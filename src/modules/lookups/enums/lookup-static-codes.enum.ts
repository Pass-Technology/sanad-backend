export enum ProfileStatusStaticCode {
    DRAFT = 'DRAFT',
    PENDING_REVIEW = 'PENDING_REVIEW',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
}

export enum ProviderTypeStaticCode {
    INDIVIDUAL = 'INDIVIDUAL',
    COMPANY = 'COMPANY',
}

export enum BillingCycleStaticCode {
    MONTHLY = 'MONTHLY',
    THREE_MONTHS = 'THREE_MONTHS',
    SIX_MONTHS = 'SIX_MONTHS',
    YEARLY = 'YEARLY',
}

export enum CompanyTypeStaticCode {
    PRIVATE = 'PRIVATE',
    GOVERNMENT = 'GOVERNMENT',
    SEMI_GOVERNMENT = 'SEMI_GOVERNMENT',
}

export enum LanguageStaticCode {
    ENGLISH = 'ENGLISH',
    ARABIC = 'ARABIC',
    URDU = 'URDU',
    HINDI = 'HINDI',
    TAGALOG = 'TAGALOG',
    FRENCH = 'FRENCH',
    SPANISH = 'SPANISH',
    GERMAN = 'GERMAN',
    PORTUGUESE = 'PORTUGUESE',
    CHINESE = 'CHINESE',
    ITALIAN = 'ITALIAN',
    RUSSIAN = 'RUSSIAN',
    JAPANESE = 'JAPANESE',
    KOREAN = 'KOREAN',
    BENGALI = 'BENGALI',
    TURKISH = 'TURKISH',
    PERSIAN = 'PERSIAN',
    DUTCH = 'DUTCH',
    POLISH = 'POLISH',
    SWEDISH = 'SWEDISH',
    DANISH = 'DANISH',
    NORWEGIAN = 'NORWEGIAN',
    FINNISH = 'FINNISH',
    GREEK = 'GREEK',
    THAI = 'THAI',
    VIETNAMESE = 'VIETNAMESE',
    INDONESIAN = 'INDONESIAN',
    MALAY = 'MALAY',
    SWAHILI = 'SWAHILI',
    HEBREW = 'HEBREW',
    UKRAINIAN = 'UKRAINIAN',
    ROMANIAN = 'ROMANIAN',
    HUNGARIAN = 'HUNGARIAN',
    CZECH = 'CZECH',
    SLOVAK = 'SLOVAK',
    BULGARIAN = 'BULGARIAN',
    CROATIAN = 'CROATIAN',
    SERBIAN = 'SERBIAN',
    AMHARIC = 'AMHARIC',
    PASHTO = 'PASHTO',
    KURDISH = 'KURDISH',
    FILIPINO = 'FILIPINO',
}

// payment lookup table

export enum PaymentLookupCategory {
    SETTLEMENT_PREFERENCE = 'SETTLEMENT_PREFERENCE',
    POS_PROVIDER = 'POS_PROVIDER',
    CARD_TYPE = 'CARD_TYPE',
}

export enum SettlementPreferenceStaticCode {
    WEEKLY = 'WEEKLY',
    MONTHLY = 'MONTHLY',
}

export enum POSProviderStaticCode {
    PAYTAB = 'PAYTAB',
    STRIPE = 'STRIPE',
}

export enum CardTypeStaticCode {
    VISA = 'VISA',
    MASTERCARD = 'MASTERCARD',
    AMERICAN_EXPRESS = 'AMERICAN_EXPRESS',
    MADA = 'MADA',
}
