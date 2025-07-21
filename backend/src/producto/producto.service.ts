import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { Repository } from 'typeorm';
import { ResponseService } from '@common/services/response/response.service';
import { Categoria } from '@categoria/entities/categoria.entity';
import { join } from 'path';
import * as fs from 'fs'
import { Request } from 'express';
import { getPublicImageUrl } from '@common/helpers/public-url.helper';

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(Producto)
    private productRepository: Repository<Producto>,
    @InjectRepository(Categoria)
    private categoryRepository: Repository<Categoria>,
    private readonly responseService: ResponseService
  ) { }

  private formatProduct(product: Producto, req: Request) {
    return {
      ...product,
      imageUrl: product.imageUrl ? getPublicImageUrl(req, product.imageUrl) : null
    }
  }

  // ### create function ###
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
        code: 'CATEGORY_NOT_FOUND', message: 'Categoria no encontrada', data: null
      }, HttpStatus.NOT_FOUND)
    }

    const newProduct = await this.productRepository.create({
      ...dto,
      category
    })

    await this.productRepository.save(newProduct)

    return this.responseService.success(
      'PRODUCT_CREATED', { productoId: newProduct.id }, 'Producto creado exitosamente'
    )
  }

  // ### updateImage function ###
  async updateImage(id: number, filename: string, req: Request) {
    const product = await this.productRepository.findOneBy({ id })

    if (!product) {
      throw new HttpException({
        code: 'PRODUCT_NOT_FOUND', message: 'Producto no encontrado', data: null
      }, HttpStatus.NOT_FOUND)
    }

    if (product.imageUrl) {
      const oldPath = join(__dirname, '..', '..', 'uploads', 'products', product.imageUrl)
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath)
      }
    }

    product.imageUrl = filename
    await this.productRepository.save(product)

    const imgUrl = getPublicImageUrl(req, filename)

    return this.responseService.success(
      'IMAGE_UPDATED', { url: imgUrl }, 'Imagen actualizada exitosamente'
    )
  }

  // ### getAll function ###
  async findAll(req: Request) {
    const products = await this.productRepository.find()
    const data = products.map(product => this.formatProduct(product, req))
    return this.responseService.success(
      'PRODUCTS_FOUND', data, 'Productos encontrados exitosamente'
    )
  }

  // ### getAllByCategory function ###
  async findByCategory(categoryId: number, req: Request) {
    const category = await this.categoryRepository.findOneBy({ id: categoryId })

    if (!category) {
      throw new HttpException({
        code: 'CATEGORY_NOT_FOUND', message: 'Categoria no encontrada', data: null
      }, HttpStatus.NOT_FOUND)
    }

    const products = await this.productRepository.find({
      where: { category: { id: categoryId } },
      relations: ['category']
    })

    const data = products.map(product => this.formatProduct(product, req))

    return this.responseService.success(
      'PRODUCTS_BY_CATEGORY_FOUND', data, 'Productos encontrados por categoria exitosamente'
    )
  }

  // ### getOne function ###
  async findOne(id: number, req: Request) {
    const product = await this.productRepository.findOneBy({ id })

    if (!product) {
      throw new HttpException({
        code: 'PRODUCT_NOT_FOUND', message: 'Producto no encontrado', data: null
      }, HttpStatus.NOT_FOUND)
    }

    return this.responseService.success(
      'PRODUCT_FOUND', this.formatProduct(product, req), 'Producto encontrado exitosamente'
    )
  }

  // ### update function ###
  async update(id: number, dto: UpdateProductoDto, req: Request) {
    const product = await this.productRepository.findOneBy({ id })

    if (!product) {
      throw new HttpException({
        code: 'PRODUCT_NOT_FOUND', message: 'Producto no encontrado', data: null
      }, HttpStatus.NOT_FOUND)
    }

    if (dto.categoryId) {
      const category = await this.categoryRepository.findOneBy({ id: dto.categoryId })

      if (!category) {
        throw new HttpException({
          code: 'CATEGORY_NOT_FOUND', message: 'Categoria no encontrado', data: null
        }, HttpStatus.NOT_FOUND)
      }
      product.category = category
    }

    const { categoryId, ..._dto } = dto
    this.productRepository.merge(product, _dto)
    await this.productRepository.save(product)

    return this.responseService.success(
      'PRODUCT_UPDATED', this.formatProduct(product, req), 'Producto actualizado exitosamente'
    )
  }

  // ### delete function ###
  async remove(id: number) {
    const product = await this.productRepository.findOneBy({ id })

    if (!product) {
      throw new HttpException({
        code: 'PRODUCT_NOT_FOUND', message: 'Producto no encontrado', data: null
      }, HttpStatus.NOT_FOUND)
    }

    await this.productRepository.remove(product)

    return this.responseService.success(
      'PRODUCT_DELETED', null, 'Producto eliminado exitosamente'
    )
  }
}
