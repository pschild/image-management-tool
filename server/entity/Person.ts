import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany } from 'typeorm';
import { Image } from './Image';

@Entity()
export class Person {

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
