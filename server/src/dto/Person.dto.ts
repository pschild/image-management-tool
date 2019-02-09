import { IPersonDto } from '../../../shared/dto/IPerson.dto';
import { ImageDto } from './Image.dto';

export class PersonDto implements IPersonDto {
    id?: number;
    firstname: string;
    lastname?: string;
    birthday?: Date;
    dateAdded?: Date;
    images?: ImageDto[];
}
