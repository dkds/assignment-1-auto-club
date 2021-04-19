export interface BufferedFile {
    originalname: string;
    mimetype: AppMimeType;
    buffer: Buffer;
}

export interface StoredFile extends HasFile, StoredFileMetadata { }

export interface HasFile {
    file: Buffer | string;
}
export interface StoredFileMetadata {
    id: string;
    name: string;
    encoding: string;
    mimetype: AppMimeType;
    size: number;
    updatedAt: Date;
    fileSrc?: string;
}

export type AppMimeType =
    | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    | 'text/csv'
    | 'image/png'
    | 'image/jpeg';