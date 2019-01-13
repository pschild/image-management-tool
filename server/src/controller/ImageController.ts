/*import { JsonController, Get, Param, Body, Post, Delete, Put } from 'routing-controllers';
import { getRepository } from 'typeorm';
import { Image } from '../entity/Image';
import { Folder } from '../entity/Folder';

@JsonController()
export class ImageController {

    private repository = getRepository(Image);

    @Get('/image')
    all() {
        return this.repository.find();
    }

    @Get('/image/:id')
    one(@Param('id') id: number) {
        return this.repository.findOne(id);
    }

    @Post('/image')
    save(@Body() body: any) {
        return this.repository.save(body);
    }

    @Put('/image/:id')
    update(@Param('id') id: number, @Body() body: any) {
        return this.repository.update(id, body);
    }

    @Delete('/image/:id')
    remove(@Param('id') id: number) {
        return this.repository.remove(
            this.repository.create({ id })
        );
    }

    async allByFolderId(folderId: number): Promise<Image[]> {
        return this.repository
            .createQueryBuilder('image')
            .innerJoinAndSelect('image.parentFolder', 'folder', 'folder.id = :folderId', { folderId })
            .getMany();
    }
}*/
