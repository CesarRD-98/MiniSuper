import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Categoria } from './entities/categoria.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriaService {

  constructor(
    @InjectRepository(Categoria)
    private categoryRepository: Repository<Categoria>,
  ) { }

  // ### Create function ###
  async create(dto: CreateCategoriaDto) {
    const exists = await this.categoryRepository.findOneBy({ name: dto.name })

    if (exists) {
      throw new HttpException({
        code: 'CATEGORY_ALREADY_EXISTS', message: 'Ya existe una categoria con este nombre', data: null
      }, HttpStatus.CONFLICT)
    }

    const newCategory = await this.categoryRepository.create(dto)
    return this.categoryRepository.save(newCategory);
  }

  // ### GetAll function ###
  async findAll() {
    return this.categoryRepository.find();
  }

  // ### GetOne function ###
  async findOne(id: number) {
    const category = await this.categoryRepository.findOneBy({ id })
    if (!category) {
      throw new HttpException({
        code: 'CATEGORY_NOT_FOUND', message: 'Categoria no encontrada', data: null
      }, HttpStatus.NOT_FOUND)
    }
    return category
  }

  // ### Update function ###
  async update(id: number, dto: UpdateCategoriaDto) {
    const category = await this.categoryRepository.findOneBy({ id })

    if (!category) {
      throw new HttpException({
        code: 'CATEGORY_NOT_FOUND', message: 'Categoria no encontrada', data: null
      }, HttpStatus.NOT_FOUND)
    }

    const updateCategory = this.categoryRepository.merge(category, dto)
    return this.categoryRepository.save(updateCategory)
  }

  // ### Delete function ###
  async remove(id: number) {
    const category = await this.categoryRepository.findOneBy({ id })

    if (!category) {
      throw new HttpException({
        code: 'CATEGORY_NOT_FOUND', message: 'Categoria no encontrada', data: null
      }, HttpStatus.NOT_FOUND)
    }

    return this.categoryRepository.remove(category)
  }
}
