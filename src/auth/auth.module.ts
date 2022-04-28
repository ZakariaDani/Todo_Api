import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/Entity/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]),
      JwtModule.register({
        secret:"Lsqdmpdk64sqd486sq8d64dqsçà(ezfe5s=",
        signOptions: {
          algorithm: 'HS512',
          expiresIn: '1d'
        }
      })
    ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
