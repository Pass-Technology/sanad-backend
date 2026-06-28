export interface PresignedPutUrlResponse {
    url: string;
    key: string;
    publicUrl: string;
    expiresIn: number;
}

export interface PresignedGetUrlResponse {
    url: string;
    expiresIn: number;
}

export interface IStorageProvider {
    upload(file: Express.Multer.File, folder: string): Promise<{ path: string, url: string }>;
    getURL(path: string): Promise<string>;
    delete(path: string): Promise<void>;
    getPresignedPutUrl(filename: string, contentType: string, folder?: string): Promise<PresignedPutUrlResponse>;
    getPresignedGetUrl(key: string, expiresIn?: number): Promise<PresignedGetUrlResponse>;
}
export const STORAGE_PROVIDER = 'STORAGE_PROVIDER';