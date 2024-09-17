import { BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm"
import { UserEntity } from "./users.entity";
import { RoleEntity } from "./roles.entity";

@Entity() 
export class PermissionEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    name: string;

    @ManyToMany(() => UserEntity, (UserEntity)  => UserEntity.permissions)
    users: UserEntity[];

    @ManyToMany (() => RoleEntity, (RoleEntity) => RoleEntity.permissions)
    roles: RoleEntity[];
}
