import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Folder } from './folder.entity';
import { Tag } from './tag.entity';
import { Person } from './person.entity';
import { Place } from './place.entity';
import { IImageEntity } from '../interface/IImageEntity';

@Entity()
export class Image implements IImageEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Folder, folder => folder.images, {
        onDelete: 'CASCADE' // delete all images when the parent folder is removed
    })
    parentFolder: Folder;

    @Column()
    name: string;

    @Column()
    extension: string;

    @Column()
    originalName: string;

    @CreateDateColumn()
    dateAdded: Date;

    @Column({nullable: true})
    description: string;

    @Column({nullable: true})
    dateFrom: Date;

    @Column({nullable: true})
    dateTo: Date;

    @ManyToMany(type => Tag, tag => tag.images)
    @JoinTable()
    tags: Tag[];

    @ManyToMany(type => Person, person => person.images)
    @JoinTable()
    persons: Person[];

    @ManyToOne(type => Place, place => place.images, {
        onDelete: 'SET NULL' // set place to null when place is removed from database
    })
    place: Place;

}
