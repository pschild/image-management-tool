import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, Tree, TreeChildren, TreeParent } from 'typeorm';
import { Image } from './Image';

@Entity()
@Tree('closure-table')
export class Folder {

    @PrimaryGeneratedColumn()
    id: number;

    @TreeChildren()
    children: Folder[];

    @TreeParent()
    parent: Folder;

    @Column()
    name: string;

    @OneToMany(type => Image, image => image.parentFolder)
    images: Image[];

    @CreateDateColumn()
    dateAdded: Date;

}
