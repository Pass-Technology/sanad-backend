export interface IStorageProvider {
    upload(file: Express.Multer.File, folder: string): Promise<{ path: string, url: string }>;
    getURL(path: string): Promise<string>;
    delete(path: string): Promise<void>;
}
export const STORAGE_PROVIDER = 'STORAGE_PROVIDER';