/*import * as path from 'path';
import { JsonController, Get, Param, Post, Body } from 'routing-controllers';
import { Folder } from '../entity/Folder';
import { Image } from '../entity/Image';
import { Tag } from '../entity/Tag';
import { getManager } from 'typeorm';
import { Person } from '../entity/Person';
import { Place } from '../entity/Place';
import * as afs from 'async-file';
import { get, post } from 'request-promise';

@JsonController()
export class WelcomeController {

    @Get('/welcome/:name')
    greet(@Param('name') name: string) {
        return `Hello, ${name}!`;
    }

    @Get('/dbtest')
    async test() {
        const folder1 = new Folder();
        folder1.name = 'A';
        await getManager().save(folder1);

        const folder2 = new Folder();
        folder2.name = 'B';
        folder2.parent = folder1;
        await getManager().save(folder2);

        const person1 = new Person();
        person1.firstname = 'Philippe';
        person1.lastname = 'Schild';
        await getManager().save(person1);

        const place1 = new Place();
        place1.name = 'Place1';
        await getManager().save(place1);

        const image1 = new Image();
        image1.name = 'Test';
        image1.originalName = 'orig';
        image1.extension = 'jpg';
        image1.parentFolder = folder1;
        image1.persons = [person1];
        image1.place = place1;
        await getManager().save(image1);

        const image2 = new Image();
        image2.name = 'Test2';
        image2.originalName = 'orig2';
        image2.extension = 'png';
        image2.parentFolder = folder1;
        await getManager().save(image2);

        const tag1 = new Tag();
        tag1.label = 'Tag1';
        tag1.images = [image1, image2];
        await getManager().save(tag1);

        const trees = await getManager().getTreeRepository(Folder).findTrees();
        return trees;
    }

    @Post('/cropImage')
    async cropImage(@Body() data: any): Promise<any> {
        const formData = {
            file: {
                value: afs.createReadStream(data.filePath),
                options: {
                    filename: path.basename(data.filePath)
                }
            },
            fuzzValue: data.fuzzValue
        };

        const cropResult = await post(`${process.env.CROP_SERVICE_URL}`, {
            formData: formData,
            json: true
        }).catch(error => {
            throw new Error(error.message);
        });

        cropResult.downloadPaths = [];
        for (const croppedImage of cropResult.croppedImages) {
            const downloadPath = await this.downloadImage(croppedImage.uri, data.filePath, croppedImage.name);
            cropResult.downloadPaths.push(downloadPath);
        }

        const removeUploadFolderResult = await get({
            uri: `${process.env.CROP_SERVICE_URL}`,
            qs: {
                action: 'removeUploadFolder',
                folderName: cropResult.uploadFolderName
            },
            json: true
        }).catch(error => {
            throw new Error(error.message);
        });

        if (!removeUploadFolderResult.success) {
            throw new Error('Upload folder could not be removed');
        }

        return cropResult;
    }

    async downloadImage(url, directory, name) {
        return new Promise<string>(async resolve => {
            await get(url)
                .pipe(afs.createWriteStream(
                    path.join(path.dirname(directory), name)
                ))
                .on('close', () => resolve(path.join(path.dirname(directory), name)));
        });
    }
}*/
