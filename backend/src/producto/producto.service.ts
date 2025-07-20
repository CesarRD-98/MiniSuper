import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { Repository } from 'typeorm';
import { ResponseService } from '@common/services/response/response.service';
import { Categoria } from '@categoria/entities/categoria.entity';

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(Producto)
    private productRepository: Repository<Producto>,
    @InjectRepository(Categoria)
    private categoryRepository: Repository<Categoria>,
    private readonly responseService: ResponseService
  ) { }

  async create(dto: CreateProductoDto) {
    const exists = await this.productRepository.findOneBy({ name: dto.name })

    if (exists) {
      throw new HttpException({
        code: 'PRODUCT_ALREADY_EXISTS', message: 'Ya existe un producto con este nombre', data: null
      }, HttpStatus.CONFLICT)
    }

    const category = await this.categoryRepository.findOneBy({ id: dto.categoryId })

    if (!category) {
      throw new HttpException({
        code: 'CATEGORY_NOT_FOUND', message: 'No existe la categoria', data: null
      }, HttpStatus.NOT_FOUND)
    }

    const newProduct = await this.productRepository.create({
      ...dto,
      category
    })

    await this.productRepository.save(newProduct)

    const product = {
      id: newProduct.id,
      name: newProduct.name,
      price: newProduct.price
    }

    return this.responseService.success(
      'PRODUCT_CREATED', product, 'Producto creado exitosamente'
    )
  }

  async findAll() {
    const products = await this.productRepository.find()
    return this.responseService.success(
      'PRODUCTS_FOUND', products, 'Productos encontrados exitosamente'
    )
  }

  async findByCategory(categoryId: number) {
    const products = await this.productRepository.find({
      where: { category: { id: categoryId } },
      relations: ['category']
    })

    return this.responseService.success(
      'PRODUCTS_BY_CATEGORY_FOUND', products, 'Productos encontrados por categoria exitosamente'
    )
  }

  findOne(id: number) {
    return `This action returns a #${id} producto`;
  }

  update(id: number, updateProductoDto: UpdateProductoDto) {
    return `This action updates a #${id} producto`;
  }

  remove(id: number) {
    return `This action removes a #${id} producto`;
  }
}
