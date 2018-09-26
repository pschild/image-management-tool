import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany } from 'typeorm';
import { Image } from './Image';

@Entity()
export class Tag {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    label: string;

    @CreateDateColumn()
    dateAdded: Date;

    @ManyToMany(type => Image, image => image.tags)
    images: Image[];
}
