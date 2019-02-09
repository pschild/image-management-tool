import { ITagDto } from '../../../shared/dto/ITag.dto';
import { ImageDto } from './Image.dto';

export class TagDto implements ITagDto {
    id?: number;
    label: string;
    dateAdded?: Date;
    images?: ImageDto[];
}
