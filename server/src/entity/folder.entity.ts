import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { Image } from './image.entity';
import { IFolderEntity } from '../../../shared/IFolderEntity';

@Entity()
export class Folder implements IFolderEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Folder, folder => folder.children, {
        onDelete: 'CASCADE' // delete all subfolders when a folder is removed
    })
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
