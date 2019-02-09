import { IImageDto } from '../../../shared/dto/IImage.dto';
import { FolderDto } from './Folder.dto';
import { TagDto } from './Tag.dto';
import { PersonDto } from './Person.dto';
import { PlaceDto } from './Place.dto';

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
    place?: PlaceDto;
    tags?: TagDto[];
    persons?: PersonDto[];
}
