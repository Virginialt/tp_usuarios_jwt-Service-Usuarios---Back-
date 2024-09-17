import { Body, HttpException, Injectable } from '@nestjs/common';
import { PermissionEntity } from 'src/entities/permissions.entity';
import { DeepPartial } from 'typeorm';

@Injectable()
export class PermissionsService {
    repository = PermissionEntity

    async createPermission (permission: DeepPartial<PermissionEntity>): Promise <PermissionEntity>{
        try {
            return await this.repository.save(permission)
        } catch (error){
            throw new HttpException('Error durante la creación del permiso', 500);
        }
    }

    async getPermissions(): Promise <PermissionEntity[]>{
        try {
            return await this.repository.find();
        } catch (error){
            throw new HttpException('Error en el listado de permisos', 500)
        }
    }

    async actualizarPermission (param: {id:number}, permission: DeepPartial<PermissionEntity>): Promise <PermissionEntity>{
        const permissionAActualizar = await this.repository.findOneBy({id: param.id});
        if (! permissionAActualizar) {
            throw new HttpException('No se encontró ningun permission con el ID ingresado', 404);
        } else {
            await this.repository.update(param.id, permission);
            return await this.repository.findOneBy({id: param.id});
        }
    }

    async deletePermission (id:number): Promise <String> {
        const permissionAEliminar = await this.repository.findOneBy({id: id});
        if (! permissionAEliminar) {
            throw new HttpException('No se encontró ningún permission con el ID ingresado', 500); 
        } else {
            await this.repository.delete({id:id})
            return 'Eliminado con éxito'
        }
    }
}
