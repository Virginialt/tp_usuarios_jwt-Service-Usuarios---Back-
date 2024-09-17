import { CanActivate,ExecutionContext, HttpException, Injectable, UnauthorizedException} from '@nestjs/common';
import { Request } from 'express';
import { UserEntity } from 'src/entities/users.entity';
import { JwtService } from 'src/jwt/jwt.service';
import { UsersService } from 'src/users/users.service';
  
  
@Injectable()
export class AuthGuard implements CanActivate {
    constructor( private jwtService: JwtService, private usersService: UsersService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const request: Request & {user: UserEntity} = context.switchToHttp().getRequest();
            const token = request.headers.authorization;
            if (token == null) {
                throw new UnauthorizedException('El token no existe');
            }
            const payload = this.jwtService.getPayload(token);
            const user = await this.usersService.findByEmail(payload.email);
            request.user = user;
            return true;
        } catch (error) {
            throw new UnauthorizedException(error?.message);
        }
    }
}