import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from './user.entity';
import { Repository } from 'typeorm';
import { AuthCredentials } from './auth.credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentials: AuthCredentials): Promise<User> {
    const { username, password } = authCredentials;

    const user = new User();
    user.username = username;
    user.salt = await bcrypt.genSalt();

    user.password = await this.hashPassword(password, user.salt);
    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username exists déjà');
      } else {
        throw new InternalServerErrorException();
      }
    }
    return user;
  }

  async validateUserPassword(
    authCredentials: AuthCredentials,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentials;
    const user = await this.userRepository.findOne({ where: { username } });
    if (user && (await user.validatePassword(password))) {
      const payload = { username };
      const accessToken = this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('mot de pass ou identifiant incorrect');
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }
}
