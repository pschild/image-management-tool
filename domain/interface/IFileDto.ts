export interface IFileDto {
    id?: number;
    name: string;
    absolutePath: string;
    extension?: string;
    isFile?: boolean;
    isDirectory?: boolean;
}
