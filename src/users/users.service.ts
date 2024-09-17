import { HttpException, Injectable, UnauthorizedException} from '@nestjs/common';
import { compareSync, hashSync } from 'bcrypt';
import { PermissionEntity } from 'src/entities/permissions.entity';
import { RoleEntity } from 'src/entities/roles.entity';
import { UserEntity } from 'src/entities/users.entity';
import { registerDTO } from 'src/interfaces/register.dto';
import { JwtService } from 'src/jwt/jwt.service';
import { DeepPartial } from 'typeorm';
import * as moment from 'moment';


@Injectable()
export class UsersService {
    repository=UserEntity;
    permissionRepository = PermissionEntity;
    roleReposity = RoleEntity;

    constructor (private jwtService: JwtService){}
    

    async createUser(body: registerDTO){
        try {
            const user = new UserEntity();
            Object.assign(user, body);
            user.password = hashSync(user.password, 10);
            await this.repository.save(user);
            return { status: 'created' };
        } catch (error) {
            throw new HttpException('Error de creacion', 500);
        }
    }

    async getUsers(): Promise <UserEntity[]>{
        try {
            return await this.repository.find();
        } catch (error){
            throw new HttpException('Error en el listado de usuarios', 500)
        }
    }

    async actualizarUser (param: {id:number}, user: DeepPartial<UserEntity>): Promise <UserEntity>{
        const userAActualizar = await this.repository.findOneBy({id: param.id});
        if (! userAActualizar) {
            throw new HttpException('No se encontró ningun usuario con el ID ingresado', 404);
        } else {
            user.password = hashSync(user.password, 10);
            await this.repository.update(param.id, user);
            return await this.repository.findOneBy({id: param.id});
        }
    }

    async deleteUser (id:number): Promise <String> {
        const userAEliminar = await this.repository.findOneBy({id: id});
        if (! userAEliminar) {
            throw new HttpException('No se encontró ningún usuario con el ID ingresado', 500); 
        } else {
            await this.repository.delete({id:id})
            return 'Eliminado con éxito'
        }
    }

    async asignarPermissionAUser(param: {id:number}, permission_body: DeepPartial<PermissionEntity>): Promise <UserEntity> {
        const user = await this.repository.findOne({ where: { id: param.id }, relations: ['permissions'] });
        if (!user){
            throw new HttpException('usuario con ID ingresado no encontrado', 404);
        } else {
            const permission = await this.permissionRepository.findOneBy({id: permission_body.id})
            if (! permission) {
                throw new HttpException('permiso con ID ingresado no encontrado', 404);
            } else {
                if (user.permissions.find((PermissionEntity) => PermissionEntity.id === permission_body.id)) {
                    throw new HttpException('El permiso ya está asignado al usuario', 400);
                }
            }
            user.permissions.push(permission);
            return await this.repository.save(user);
        }
    }

    async asignarRoleAUser(param: {id:number}, role_body: DeepPartial<RoleEntity>): Promise <UserEntity> {
        const user = await this.repository.findOne({ where: { id: param.id }, relations: ['roles'] });
        if (!user){
            throw new HttpException('usuario con ID ingresado no encontrado', 404);
        } else {
            const role = await this.roleReposity.findOneBy({id: role_body.id})
            if (! role) {
                throw new HttpException('rol con ID ingresado no encontrado', 404);
            } else {
                if (user.roles.find((RoleEntity) => RoleEntity.id === role_body.id)) {
                    throw new HttpException('El rol ya está asignado al usuario', 400);
                }
            }
            user.roles.push(role);
            return await this.repository.save(user);
        }
    }

    async login(body: registerDTO) {
        const user = await this.findByEmail(body.email);
        if (user == null) {
          throw new UnauthorizedException();
        }
        const compareResult = compareSync(body.password, user.password);
        
        if (!compareResult) {
          throw new UnauthorizedException();
        }
        return {
          accessToken: this.jwtService.generateToken({email: user.email}, 'auth'),
          refreshToken: this.jwtService.generateToken({email: user.email}, 'refresh'),
          expirationTime: moment().add(10, 'minutes').toDate()
        }
    }

    async refreshToken(refreshToken: string){
        try {
            return this.jwtService.refreshToken(refreshToken)
        } catch (error) {
            throw new UnauthorizedException();
        }
    }

    async findByEmail(email: string): Promise<UserEntity> {
        return await this.repository.findOneBy({email});
    }

    async canDo(user: UserEntity, permission_param: number): Promise <Boolean> {
        const user_ = await this.repository.findOne({ where: { id: user.id }, relations: ['permissions'] });
        const tienePermiso = user_.permissions.some(PermissionEntity => PermissionEntity.id == permission_param);
        if (tienePermiso){
            return true;
        } else {
            throw new UnauthorizedException('El usuario no tiene permiso');
        }
    }
}
