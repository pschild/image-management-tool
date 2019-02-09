import { IImageDto } from '../../../shared/dto/IImage.dto';
import { FolderDto } from './Folder.dto';
import { IPlaceEntityDto } from '../../../shared/dto/IPlaceEntity.dto';
import { ITagEntityDto } from '../../../shared/dto/ITagEntity.dto';
import { IPersonEntityDto } from '../../../shared/dto/IPersonEntity.dto';

export class ImageDto implements IImageDto {
    id?: number;
    name: string;
    extension: string;
    absolutePath: string;
    originalName?: string;
    description?: string;
    parentFolder?: FolderDto;
    dateAdded?: Date;
    dateFrom?: Date;
    dateTo?: Date;
    place?: IPlaceEntityDto;
    tags?: ITagEntityDto[];
    persons?: IPersonEntityDto[];
}
