/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule} from "@nestjs/jwt"; 
import { PassportModule} from "@nestjs/passport"; 
import User from './user.entity';
import { JwtStrategy } from './jwtStrategy';
import * as config from "config"; 

const jwtConfig = config.get("jwt"); 

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy:'jwt'
    }),
    JwtModule.register({
      secret:jwtConfig.secret, 
      signOptions:{
        expiresIn:jwtConfig.expiresIn
      }
    }),
    TypeOrmModule.forFeature([User])
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy, PassportModule]
})
export class AuthModule {}
