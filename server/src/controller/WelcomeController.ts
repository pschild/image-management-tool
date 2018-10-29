import { JsonController, Get, Param } from 'routing-controllers';
import { Folder } from '../entity/Folder';
import { Image } from '../entity/Image';
import { Tag } from '../entity/Tag';
import { getManager } from 'typeorm';
import { Person } from '../entity/Person';
import { Place } from '../entity/Place';

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
}

