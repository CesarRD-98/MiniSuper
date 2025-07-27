import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly userRepositorio: Repository<Usuario>,
  ) { }

  async create(dto: CreateUsuarioDto) {
    const exists = await this.userRepositorio.findOneBy({ email: dto.email })
    if (exists) {
      throw new HttpException({
        code: 'USER_ALREADY_EXISTS', message: 'Usuario ya existe con el correo', data: null
      }, HttpStatus.CONFLICT)
    }

    const newUser = await this.userRepositorio.create(dto)
    
    return await this.userRepositorio.save(newUser) 
  }

  findAll() {
    return `This action returns all usuario`;
  }

  findOne(id: number) {
    return `This action returns a #${id} usuario`;
  }

  async findByEmail(email: string) {
    const user = await this.userRepositorio.findOneBy({ email })
    return user;
  }

  update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return `This action updates a #${id} usuario`;
  }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }
}
