import { ProfileStatusStaticCode } from "../../../../modules/lookups/enums/lookup-static-codes.enum";

export const profileStatusObjects = [
    { id: 'de305d54-75b4-431b-adb2-eb6b9e546013', labelEn: 'Draft', labelAr: 'مسودة', staticCode: ProfileStatusStaticCode.DRAFT },
    { id: '8f3b7d1e-84b2-4d2c-8b8a-1c8a1e8a1e8a', labelEn: 'Pending Review', labelAr: 'قيد المراجعة', staticCode: ProfileStatusStaticCode.PENDING_REVIEW },
    { id: 'c1a2d3e4-b5c6-4d7e-8f9a-0b1c2d3e4f5a', labelEn: 'Approved', labelAr: 'مقبول', staticCode: ProfileStatusStaticCode.APPROVED },
    { id: 'd2e3f4a5-b6c7-4d8e-9f0a-1b2c3d4e5f6a', labelEn: 'Rejected', labelAr: 'مرفوض', staticCode: ProfileStatusStaticCode.REJECTED }
];
