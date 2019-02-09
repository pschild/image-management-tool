import { IFolderDto } from '../../../shared/dto/IFolder.dto';
import { IImageEntityDto } from '../../../shared/dto/IImageEntity.dto';

export class FolderDto implements IFolderDto {
    id: number;
    name: string;
    absolutePath: string;
    parent: FolderDto;
    children?: FolderDto[];
    images?: IImageEntityDto[];
    dateAdded?: Date;
}
