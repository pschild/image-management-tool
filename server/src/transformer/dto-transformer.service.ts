import { Injectable } from '@nestjs/common';
import { ClassType } from 'class-transformer/ClassTransformer';
import { classToPlain, plainToClass } from 'class-transformer';

@Injectable()
export class DtoTransformerService {

    transform<T, E>(value: T, newType: ClassType<E>): E {
        const plain = classToPlain(value);
        return plainToClass(newType, plain);
    }

    transformList<T, E>(value: T[], newType: ClassType<E>): E[] {
        const plainList: object[] = value.map((item: T) => classToPlain(item));
        return plainList.map((item: object) => plainToClass(newType, item));
    }

}
