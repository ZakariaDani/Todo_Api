import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserDto } from 'src/DTO/registerUser.dto';
import { UserEntity } from 'src/Entity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { LogUserDto } from 'src/DTO/logUser.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private repo: Repository<UserEntity>,
    private jwt: JwtService,
  ) {}

  async registerUser(registerDto: RegisterUserDto) {
    const { username, password } = registerDto;
    const hashed = await bcrypt.hash(password, 12);
    const salt = await bcrypt.getSalt(hashed);

    const foundUser = await this.repo.findOne({ username });

    if (foundUser) {
      throw new BadRequestException('User already exists!');
    } else {
      console.log(hashed, salt);

      const user = new UserEntity();
      user.username = username;
      user.password = hashed;
      user.salt = salt;

      this.repo.create(user);
      try {
        return await this.repo.save(user);
      } catch (error) {
        throw new InternalServerErrorException('Something went wrong !');
      }
    }
  }

  async loginUser(logUserDto: LogUserDto) {
    const { username, password } = logUserDto;
    const user = await this.repo.findOne({ username });
    if (!user) {
      throw new UnauthorizedException('Invalid Operation.');
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (isPasswordMatch) {
      const jwtPayload = { username };
      const jwtToken = await this.jwt.signAsync(jwtPayload, {
        expiresIn: '1d',
        algorithm: 'HS512',
      });
      return { token: jwtToken };
    } else {
      throw new UnauthorizedException('Invalid Operation.');
    }
  }
}
