import { IPersonDto } from '../../../shared/dto/IPerson.dto';
import { ImageDto } from './Image.dto';
import { Exclude, Type } from 'class-transformer';

export class PersonDto implements IPersonDto {
    id?: number;
    firstname: string;
    lastname?: string;
    birthday?: Date;

    @Exclude()
    dateAdded?: Date;

    @Type(() => ImageDto)
    images?: ImageDto[];
}
