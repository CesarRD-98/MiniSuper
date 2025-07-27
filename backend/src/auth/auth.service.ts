import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from '@usuario/usuario.service';
import * as bcrypt from 'bcrypt'
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usuarioService: UsuarioService,
        private readonly jwtService: JwtService
    ) { }

    private generateJwt(user: any) {
        const payload = { sub: user.id, name: user.name, email: user.email, role: user.role }
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        }
    }

    async register(dto: RegisterDto) {
        const exists = await this.usuarioService.findByEmail(dto.email)
        if (exists) {
            throw new HttpException({
                code: 'USER_ALREADY_EXISTS', message: 'Ya existe una cuenta vinculada al correo', data: null
            }, HttpStatus.CONFLICT)
        }

        const hash = await bcrypt.hash(dto.password, 10)
        const newUser = await this.usuarioService.create({
            ...dto,
            password: hash
        })

        return this.generateJwt(newUser)
    }

    async login(dto: LoginDto) {
        const user = await this.usuarioService.findByEmail(dto.email)
        if (!user) {
            throw new HttpException({
                code: 'USER_NOT_FOUND', message: 'Usuario no encontrado', data: null
            }, HttpStatus.NOT_FOUND)
        }

        if (!await bcrypt.compare(dto.password, user.password)) {
            throw new HttpException({
                code: 'INVALID_CREDENTIALS', message: 'Credenciales invalidas', data: null
            }, HttpStatus.UNAUTHORIZED)
        }

        return this.generateJwt(user)
    }
}
