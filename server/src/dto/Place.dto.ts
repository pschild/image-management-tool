import { ImageDto } from './Image.dto';
import { IPlaceDto } from '../../../shared/dto/IPlace.dto';
import { Type, Exclude } from 'class-transformer';

export class PlaceDto implements IPlaceDto {
    id?: number;
    name: string;
    address?: string;
    city?: string;
    country?: string;

    @Exclude()
    dateAdded?: Date;

    @Type(() => ImageDto)
    images?: ImageDto[];
}
