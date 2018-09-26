import { getRepository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import { Image } from '../entity/Image';

export class ImageController {

    private repository = getRepository(Image);

    async all(request: Request, response: Response, next: NextFunction) {
        return this.repository.find();
    }

    async one(request: Request, response: Response, next: NextFunction) {
        return this.repository.findOne(request.params.id);
    }

    async save(request: Request, response: Response, next: NextFunction) {
        return this.repository.save(request.body);
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        return this.repository.remove(
            this.repository.create({ id: request.params.id })
        );
    }
}
