export interface IMergedImageDto {
    id?: number;
    name: string;
    extension: string;
    absolutePath: string;
    size?: number;
    addedInFs: boolean;
    removedInFs: boolean;
}
