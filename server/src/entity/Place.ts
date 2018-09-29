import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Image } from './Image';

@Entity()
export class Place {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({nullable: true})
    address: string;

    @Column({nullable: true})
    city: string;

    @Column({nullable: true})
    country: string;

    @CreateDateColumn()
    dateAdded: Date;

    @OneToMany(type => Image, image => image.place)
    images: Image[];
}
