import { HttpException, Injectable } from '@nestjs/common';
import { PermissionEntity } from 'src/entities/permissions.entity';
import { RoleEntity } from 'src/entities/roles.entity';
import { DeepPartial } from 'typeorm';

@Injectable()
export class RolesService {
    repository=RoleEntity;
    permissionRepository = PermissionEntity;

    async createRole(role: DeepPartial<RoleEntity>): Promise <RoleEntity>{
        try {
            return await this.repository.save(role);
        } catch (error){
            throw new HttpException('Error en la creación del rol', 404)
        }
    }

    async getRoles(): Promise <RoleEntity[]>{
        try {
            return await this.repository.find();
        } catch (error){
            throw new HttpException('Error en el listado de roles', 500)
        }
    }

    async actualizarRole (param: {id:number}, role: DeepPartial<RoleEntity>): Promise <RoleEntity>{
        const roleAActualizar = await this.repository.findOneBy({id: param.id});
        if (! roleAActualizar) {
            throw new HttpException('No se encontró ningun role con el ID ingresado', 404);
        } else {
            await this.repository.update(param.id, role);
            return await this.repository.findOneBy({id: param.id});
        }
    }

    async deleteRole (id:number): Promise <String> {
        const roleAEliminar = await this.repository.findOneBy({id: id});
        if (! roleAEliminar) {
            throw new HttpException('No se encontró ningún rol con el ID ingresado', 500); 
        } else {
            await this.repository.delete({id:id})
            return 'Eliminado con éxito'
        }
    }

    async asignarPermissionARol(param: {id:number}, permission_body: DeepPartial<PermissionEntity>): Promise <RoleEntity> {
        const role = await this.repository.findOne({ where: { id: param.id }, relations: ['permissions'] });
        if (!role){
            throw new HttpException('role con ID ingresado no encontrado', 404);
        } else {
            const permission = await this.permissionRepository.findOneBy({id: permission_body.id})
            if (! permission) {
                throw new HttpException('permiso con ID ingresado no encontrado', 404);
            } else {
                if (role.permissions.find((PermissionEntity) => PermissionEntity.id === permission_body.id)) {
                    throw new HttpException('El permiso ya está asignado al rol', 400);
                }
            }
            role.permissions.push(permission);
            return await this.repository.save(role);
        }
    }
}
