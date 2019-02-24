import { IImageDto } from '../../../shared/dto/IImage.dto';
import { FolderDto } from './Folder.dto';
import { TagDto } from './Tag.dto';
import { PersonDto } from './Person.dto';
import { PlaceDto } from './Place.dto';
import { Exclude, Type } from 'class-transformer';

export class ImageDto implements IImageDto {
    id?: number;
    name: string;
    extension: string;
    absolutePath: string;
    originalName?: string;
    description?: string;
    dateFrom?: Date;
    dateTo?: Date;

    @Exclude()
    dateAdded?: Date;

    @Type(() => FolderDto)
    parentFolder?: FolderDto;

    @Type(() => PlaceDto)
    place?: PlaceDto;

    @Type(() => TagDto)
    tags?: TagDto[];

    @Type(() => PersonDto)
    persons?: PersonDto[];
}
