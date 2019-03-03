import { ITagDto } from '../../../shared/dto/ITag.dto';
import { ImageDto } from './Image.dto';
import { Exclude, Type } from 'class-transformer';

export class TagDto implements ITagDto {
    id?: number;
    label: string;

    @Exclude()
    dateAdded?: Date;

    @Type(() => ImageDto)
    images?: ImageDto[];
}
