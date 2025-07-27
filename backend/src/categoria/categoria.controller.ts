import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { ResponseService } from '@common/services/response/response.service';
import { ResponseController } from '@common/services/response/response.controller';

@Controller('categoria')
export class CategoriaController extends ResponseController {
  constructor(
    private readonly categoriaService: CategoriaService,
    responseService: ResponseService
  ) {
    super(responseService)
  }

  @Post()
  async create(@Body() dto: CreateCategoriaDto) {
    const newCategory = await this.categoriaService.create(dto);
    return this.success(
      'CATEGORY_CREATED', newCategory, 'Categoria creada exitosamente'
    )
  }

  @Get()
  async findAll() {
    const results = await this.categoriaService.findAll();
    return this.success(
      'CATEGORIES_FOUND', results, 'Categorias encontradas exitosamente'
    )
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const category = await this.categoriaService.findOne(id);
    return this.success(
      'CATEGORY_FOUND', category, 'Categoria encontrada exitosamente'
    )
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCategoriaDto) {
    const category = await this.categoriaService.update(id, dto);
    return this.success(
      'CATEGORY_UPDATED', category, 'Categoria actualizada exitosamente'
    )
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.categoriaService.remove(id);
    return this.success(
      'CATEGORY_DELETED', null, 'Categoria eliminada exitosamente'
    )
  }
}
