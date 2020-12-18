import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, JoinColumn, JoinTable} from "typeorm";
import { v4 as uuid } from 'uuid';
import { Bucket } from './Bucket'

@Entity('users')
export class User extends BaseEntity {

    @PrimaryGeneratedColumn(uuid)
    uuid: number;

    @Column("varchar", {length: 50})
    nickname: string;

    @Column("varchar", {length: 50})
    email: string;

    @Column("varchar", {length: 250})
    password: string;

    @Column({ type: "varchar", nullable: true})    
    resetLink: string;

    @OneToMany(() => Bucket, bucket => bucket.user)
    bucket: Bucket[];
}
