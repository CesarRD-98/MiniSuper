import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Categoria } from './entities/categoria.entity';
import { Repository } from 'typeorm';
import { ResponseService } from '@common/services/response/response.service';

@Injectable()
export class CategoriaService {

  constructor(
    @InjectRepository(Categoria)
    private categoryRepository: Repository<Categoria>,
    private readonly responseServices: ResponseService
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
    await this.categoryRepository.save(newCategory);

    return this.responseServices.success(
      'CATEGORY_CREATED', newCategory, 'Categoria creada exitosamente'
    )
  }

  // ### GetAll function ###
  async findAll() {
    const results = await this.categoryRepository.find();
    return this.responseServices.success(
      'CATEGORIES_FOUND', results, 'Categorias encontradas exitosamente'
    )
  }

  // ### GetOne function ###
  async findOne(id: number) {
    const category = await this.categoryRepository.findOneBy({ id })
    if (!category) {
      throw new HttpException({
        code: 'CATEGORY_NOT_FOUND', message: 'Categoria no encontrada', data: null
      }, HttpStatus.NOT_FOUND)
    }
    return this.responseServices.success(
      'CATEGORY_FOUND', category, 'Categoria encontrada exitosamente'
    )
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
    await this.categoryRepository.save(updateCategory)

    return this.responseServices.success(
      'CATEGORY_UPDATED', updateCategory, 'Categoria actualizada exitosamente'
    )
  }

  // ### Delete function ###
  async remove(id: number) {
    const category = await this.categoryRepository.findOneBy({ id })

    if (!category) {
      throw new HttpException({
        code: 'CATEGORY_NOT_FOUND', message: 'Categoria no encontrada', data: null
      }, HttpStatus.NOT_FOUND)
    }

    await this.categoryRepository.remove(category)

    return this.responseServices.success(
      'CATEGORY_DELETED', null, 'Categoria eliminada exitosamente'
    )
  }
}
