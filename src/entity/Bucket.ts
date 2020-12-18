import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, BaseEntity, RelationId} from "typeorm";
import { User } from "./User";
import { Blob } from './Blob'


@Entity()
export class Bucket extends BaseEntity{
    
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column("varchar", {length: 50})
    bucketName: string;

    @OneToMany(() => Blob, blob => blob.bucket)
    blob: Blob[];
    
    @ManyToOne(() => User, user => user.bucket)
    user: User;

    @RelationId((bucket: Bucket) => bucket.user) // This is just to save the foreign key in this attribute.
    userId: number 
}