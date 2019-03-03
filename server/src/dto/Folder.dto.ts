import { IFolderDto } from '../../../shared/dto/IFolder.dto';
import { ImageDto } from './Image.dto';
import { Exclude, Type } from 'class-transformer';

export class FolderDto implements IFolderDto {
    id: number;
    name: string;
    absolutePath: string;

    @Exclude()
    dateAdded?: Date;

    @Type(() => FolderDto)
    parent: FolderDto;

    @Type(() => FolderDto)
    children?: FolderDto[];

    @Type(() => ImageDto)
    images?: ImageDto[];
}
