import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany } from 'typeorm';
import { Image } from './image.entity';
import { IPersonEntity } from '../interface/IPersonEntity';

@Entity()
export class Person implements IPersonEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstname: string;

    @Column({nullable: true})
    lastname: string;

    @Column({nullable: true})
    birthday: Date;

    @CreateDateColumn()
    dateAdded: Date;

    @ManyToMany(type => Image, image => image.persons)
    images: Image[];
}
