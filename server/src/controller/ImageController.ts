import { JsonController, Get, Param, Body, Post, Delete, Put } from 'routing-controllers';
import { getRepository } from 'typeorm';
import { Image } from '../entity/Image';

@JsonController()
export class ImageController {

    private repository = getRepository(Image);

    @Get('/images')
    all() {
        return this.repository.find();
    }

    @Get('/images/:id')
    one(@Param('id') id: number) {
        return this.repository.findOne(id);
    }

    async allByFolderId(folderId: number) {
        return this.repository
            .createQueryBuilder('image')
            .innerJoin('image.parentFolder', 'folder', 'folder.id = :folderId', { folderId })
            .getMany();
    }

    @Post('/images')
    save(@Body() body: any) {
        return this.repository.save(body);
    }

    @Put('/images/:id')
    update(@Param('id') id: number, @Body() body: any) {
        return this.repository.update(id, body);
    }

    @Delete('/images/:id')
    remove(@Param('id') id: number) {
        return this.repository.remove(
            this.repository.create({ id })
        );
    }
}
