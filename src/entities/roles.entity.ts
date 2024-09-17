import { BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { PermissionEntity } from "./permissions.entity";
import { UserEntity } from "./users.entity";

@Entity()
export class RoleEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    code: string;

    @Column()
    descripcion:string;

    @ManyToMany(() => PermissionEntity, (PermissionEntity) => PermissionEntity.roles)
    @JoinTable()
    permissions: PermissionEntity[];

    @ManyToMany (() => UserEntity, (UserEntity) => UserEntity.roles)
    users: UserEntity[];
}