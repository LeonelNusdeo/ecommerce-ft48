import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from './roles.enum';
import { User } from '../users/users.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async getAuth() {
    return 'Devuelve autenticacion.';
  }

  async signIn(email: string, password: string) {
    const user = await this.usersRepository.getUserByEmail(email);
    if (!user) throw new BadRequestException(`Credenciales inválidas.`);

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      throw new BadRequestException(`Credenciales inválidas.`);

    const payload = {
      id: user.id,
      email: user.email,
      roles: [user.isAdmin ? Role.Admin : Role.User],
    };
    const token = this.jwtService.sign(payload);

    return {
      message: 'Usuario logueado correctamente.',
      token,
    };
  }

  async signUp(user: Partial<User>) {
    const foundUser = await this.usersRepository.getUserByEmail(user.email);
    if (foundUser)
      throw new BadRequestException(
        `EMAIL: ${user.email} ya se encuentra registrado.`,
      );

    const hashedPassword = await bcrypt.hash(user.password, 10);
  
    return await this.usersRepository.addUser({
      ...user,
      password: hashedPassword,
    });
  }
}
