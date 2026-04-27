export enum Gender {
    MALE = "Male",
    FEMALE = "Female",
    MIXED = "Mixed"
}

export enum IncomeLevel {
    LOW = "Low",
    MEDIUM = "Medium",
    HIGH = "High"
}

export enum EducationLevel {
    UNEDUCATED = "Uneducated",
    PRIMARY = "Primary",
    SECONDARY = "Secondary",
    DIPLOMA = "Diploma",
    UNIVERSITY = "University",
    HIGHER_ED = "Higher Ed"
}

export enum ResidencyStatus {
    RESIDENT = "Resident",
    VISITOR = "Visitor"
}

export enum WorkStructure {
    SOLO = "Solo",
    WITH_TEAM = "With Team"
}

export enum WorkingHours {
    MORNING = "Morning",
    AFTERNOON = "Afternoon",
    EVENING = "Evening",
    ALL_DAY = "All Day"
}

export enum DeliveryLocations {
    HOMES = "Homes",
    OFFICES = "Offices",
    STORES = "Stores",
    WORK_SITES = "Work Sites",
    MIXED = "Mixed"
}

export enum LeadSources {
    WHATSAPP = "WhatsApp",
    PHONE = "Phone",
    REFERRAL = "Referral",
    INSTAGRAM = "Instagram",
    ADS = "Ads",
    OTHER = "Other"
}

export enum Categories {
    INDIVIDUALS = "Individuals",
    FAMILIES = "Families",
    COMPANIES = "Companies",
    GOVERNMENT = "Government"
}

export enum DominantGender {
    MEN = "Men",
    WOMEN = "Women",
    MIXED = "Mixed"
}

export enum CustomerAgeRange {
    UNDER_20 = "Under 20",
    AGE_20_30 = "20-30",
    AGE_30_40 = "30-40",
    AGE_40_50 = "40-50",
    OVER_50 = "Over 50"
}

export enum ReasonsForChoosing {
    PRICE = 'Price',
    SPEED = 'Speed',
    QUALITY = 'Quality',
    LOCATION = 'Location',
    SERVICE = 'Service',
    EXPERTISE = 'Expertise'
}

export enum PeakDemandTime {
    MORNING = 'Morning',
    EVENING = 'Evening',
    WEEKENDS = 'Weekends'
}

export enum CustomerRetention {
    HIGH = 'High',
    OCCASIONAL = 'Occasional',
    RARE = 'Rare'
}

export enum ResponseToPriceIncrease {
    STAY = 'Stay',
    HESITATE = 'Hesitate',
    CANCEL = 'Cancel'
}

export interface NumericRange {
    min: number;
    max?: number;
    label: string;
}

export interface BasicInfo {
    ageGroups: { from: number; to: number };
    gender: Gender;
    residencyStatus: ResidencyStatus;
    educationLevel: EducationLevel;
    incomeLevel: IncomeLevel;
}

export interface Services {
    homeService: boolean;
    productDelivery: boolean;
}

export interface Operations {
    dailyCapacity: number;
    workingHours: WorkingHours;
    workStructure: WorkStructure;
    hasTransportation: boolean;
}

export interface CustomerProfile {
    categories: Categories;
    dominantGender: DominantGender;
    ageRange: CustomerAgeRange;
    nationalities: string;
    deliveryLocations: DeliveryLocations;
    incomeLevel: IncomeLevel;
    highestDemandCities: string;
    leadSources: LeadSources;
}

export interface PurchasingBehavior {
    avgOrderValue: NumericRange;
    reasonsForChoosing: ReasonsForChoosing;
    peakDemandTime: PeakDemandTime;
    isSeasonal: boolean;
    customerRetention: CustomerRetention;
    responseToPriceIncrease: ResponseToPriceIncrease;
}

export interface TargetAudienceProfileSections {
    basicInfo: BasicInfo;
    services: Services;
    operations: Operations;
    customer: CustomerProfile;
    purchasing: PurchasingBehavior;
    strategy: boolean | 'Later';
}
