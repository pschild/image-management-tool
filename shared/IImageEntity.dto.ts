import { IPersonEntityDto } from './IPersonEntity.dto';
import { ITagEntityDto } from './ITagEntity.dto';
import { IPlaceEntityDto } from './IPlaceEntity.dto';
import { IFolderEntityDto } from './IFolderEntity.dto';

export interface IImageEntityDto {
    id?: number;
    name: string;
    extension: string;
    absolutePath: string;
    originalName?: string;
    description?: string;
    parentFolder?: IFolderEntityDto;
    dateAdded?: string;
    dateFrom?: string;
    dateTo?: string;
    place?: IPlaceEntityDto;
    tags?: ITagEntityDto[];
    persons?: IPersonEntityDto[];
}
