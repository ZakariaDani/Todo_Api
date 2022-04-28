import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserDto } from 'src/DTO/registerUser.dto';
import { UserEntity } from 'src/Entity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(@InjectRepository(UserEntity) private repo: Repository<UserEntity>) {}


    async registerUser(registerDto:RegisterUserDto) {
        const {username, password} = registerDto;
        const hashed = await bcrypt.hash(password,12);
        const salt = await bcrypt.getSalt(hashed);
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
