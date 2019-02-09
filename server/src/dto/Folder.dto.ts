import { IFolderDto } from '../../../shared/dto/IFolder.dto';
import { ImageDto } from './Image.dto';

export class FolderDto implements IFolderDto {
    id: number;
    name: string;
    absolutePath: string;
    parent: FolderDto;
    children?: FolderDto[];
    images?: ImageDto[];
    dateAdded?: Date;
}
