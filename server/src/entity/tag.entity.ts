import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany } from 'typeorm';
import { Image } from './image.entity';
import { ITagEntity } from '../interface/ITagEntity';

@Entity()
export class Tag implements ITagEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    label: string;

    @CreateDateColumn()
    dateAdded: Date;

    @ManyToMany(type => Image, image => image.tags)
    images: Image[];
}
