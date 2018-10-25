import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { Image } from './Image';

@Entity()
export class Folder {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Folder, folder => folder.children)
    parent: Folder;

    @OneToMany(type => Folder, folder => folder.parent)
    children: Folder[];

    @Column()
    name: string;

    @OneToMany(type => Image, image => image.parentFolder)
    images: Image[];

    @CreateDateColumn()
    dateAdded: Date;

}
