import { IFolderDto } from './IFolder.dto';
import { IPlaceDto } from './IPlace.dto';
import { ITagDto } from './ITag.dto';
import { IPersonDto } from './IPerson.dto';

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
    place?: IPlaceDto;
    tags?: ITagDto[];
    persons?: IPersonDto[];
}
