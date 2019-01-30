export interface IFsFile {
    name: string;
    absolutePath: string;
    extension?: string;
    isFile?: boolean;
    isDirectory?: boolean;
}
