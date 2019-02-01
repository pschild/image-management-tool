import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Image } from './image.entity';
import { IPlaceEntity } from '../interface/IPlaceEntity';

@Entity()
export class Place implements IPlaceEntity {

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
