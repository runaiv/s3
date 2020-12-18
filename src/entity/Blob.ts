import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity, RelationId} from "typeorm";
import { Bucket } from "./Bucket";


@Entity()
export class Blob extends BaseEntity{
    
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column("varchar", {length: 150})
    name: string;

    @Column("varchar", {length: 50})
    path: string;

    @Column("varchar", {length: 50})
    size: string;
  
    @ManyToOne(() => Bucket, bucket => bucket.blob)
    bucket: Bucket;

    @RelationId((blob: Blob) => blob.bucket)
    bucketId: number 
}