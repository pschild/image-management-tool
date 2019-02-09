import { IPersonEntityDto } from './IPersonEntity.dto';
import { ITagEntityDto } from './ITagEntity.dto';
import { IPlaceEntityDto } from './IPlaceEntity.dto';
import { IFolderDto } from './IFolder.dto';

export interface IImageDto {
    id?: number;
    name: string;
    extension: string;
    absolutePath: string;
    originalName?: string;
    description?: string;
    parentFolder?: IFolderDto;
    dateAdded?: Date;
    dateFrom?: Date;
    dateTo?: Date;
    place?: IPlaceEntityDto;
    tags?: ITagEntityDto[];
    persons?: IPersonEntityDto[];
}
