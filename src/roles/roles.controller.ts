import { Body, Controller, Get, Param, Post, Put, Delete } from '@nestjs/common';
import { RolesService } from './roles.service';
import { DeepPartial } from 'typeorm';
import { RoleEntity } from 'src/entities/roles.entity';
import { PermissionEntity } from 'src/entities/permissions.entity';

@Controller('roles')
export class RolesController {
    constructor (private service: RolesService){}

    @Post()
    async createRole(@Body() role: DeepPartial<RoleEntity>): Promise <RoleEntity>{
        return await this.service.createRole(role);
    }

    @Get()
    async getRoles(): Promise <RoleEntity[]> {
        return await this.service.getRoles();
    }

    @Put(':id')
    async actualizarRole (@Param() param: {id:number}, @Body() role: DeepPartial<RoleEntity>): Promise <RoleEntity>{
        return await this.service.actualizarRole(param, role);
    }

    @Delete(':id')
    async deleteRole (@Param() param: {id:number}):  Promise <String> {
        return await this.service.deleteRole(param.id);
    }

    @Post(':id/permissions')
    async asignarPermissionARol(@Param() param: {id:number}, @Body() permission_body: DeepPartial<PermissionEntity>): Promise <RoleEntity>{
        return await this.service.asignarPermissionARol(param, permission_body);
    }
}
