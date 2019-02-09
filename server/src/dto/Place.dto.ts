import { ImageDto } from './Image.dto';
import { IPlaceDto } from '../../../shared/dto/IPlace.dto';

export class PlaceDto implements IPlaceDto {
    id?: number;
    name: string;
    address?: string;
    city?: string;
    country?: string;
    dateAdded?: Date;
    images?: ImageDto[];
}
