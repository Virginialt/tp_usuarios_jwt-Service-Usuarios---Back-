import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PermissionsModule } from './permissions/permissions.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import { entities } from './entities';
import { JwtModule } from './jwt/jwt.module';
import { AuthGuard } from './middlewares/auth.middleware';

@Module({
  imports: [PermissionsModule, UsersModule, RolesModule, TypeOrmModule.forRoot({
    type: 'sqlite',
    database: 'baseDeDatos.db',
    entities,
    synchronize:true

  }), JwtModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
