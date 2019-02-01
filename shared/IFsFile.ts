export interface IFsFile {
    name: string;
    absolutePath: string;
    extension?: string;
    size?: number;
    isFile?: boolean;
    isDirectory?: boolean;
}
