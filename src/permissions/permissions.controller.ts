import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { DeepPartial } from 'typeorm';
import { PermissionEntity } from 'src/entities/permissions.entity';

@Controller('permissions')
export class PermissionsController {
    constructor (private service: PermissionsService){}

    @Post()
    async createPermission(@Body() permission: DeepPartial<PermissionEntity>): Promise <PermissionEntity>{
        return await this.service.createPermission(permission)
    }

    @Get()
    async getPermissions(): Promise <PermissionEntity[]> {
        return await this.service.getPermissions();
    }

    @Put(':id')
    async actualizarPermission (@Param() param: {id:number}, @Body() permission: DeepPartial<PermissionEntity>): Promise <PermissionEntity>{
        return await this.service.actualizarPermission(param, permission);
    }

    @Delete(':id')
    async deletePermission (@Param() param: {id:number}):  Promise <String> {
        return await this.service.deletePermission (param.id)
    }   
}