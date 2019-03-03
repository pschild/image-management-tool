import { Injectable } from '@nestjs/common';
import { ClassType } from 'class-transformer/ClassTransformer';
import { classToPlain, plainToClass } from 'class-transformer';

@Injectable()
export class DtoTransformerService {

    transform<E, D>(value: E, newType: ClassType<D>): D {
        const plain = classToPlain(value);
        return plainToClass(newType, plain);
    }

    transformList<E, D>(value: E[], newType: ClassType<D>): D[] {
        const plainList: object[] = value.map((item: E) => classToPlain(item));
        return plainList.map((item: object) => plainToClass(newType, item));
    }

}
