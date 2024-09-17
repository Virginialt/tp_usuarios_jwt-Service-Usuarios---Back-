import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtModule } from 'src/jwt/jwt.module';
import { AuthGuard } from 'src/middlewares/auth.middleware';

@Module({
  controllers: [UsersController],
  providers: [UsersService, AuthGuard],
  imports: [JwtModule]
})
export class UsersModule {}
