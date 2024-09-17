import {BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from 'typeorm';
import { PermissionEntity } from './permissions.entity';
import { RoleEntity } from './roles.entity';

@Entity('users')
export class UserEntity extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email:string;

    @Column()
    password: string;

    @ManyToMany(() => PermissionEntity, (PermissionEntity) => PermissionEntity.users)
    @JoinTable()
    permissions: PermissionEntity[];

    @ManyToMany(() => RoleEntity, (RoleEntity) => RoleEntity.users)
    @JoinTable()
    roles: RoleEntity[];
}