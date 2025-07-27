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
import { ResponseController } from '@common/services/response/response.controller';

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(Producto)
    private productRepository: Repository<Producto>,
    @InjectRepository(Categoria)
    private categoryRepository: Repository<Categoria>,
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

    return this.productRepository.save(newProduct)
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

    return getPublicImageUrl(req, filename)
  }

  // ### getAll function ###
  async findAll(req: Request) {
    const products = await this.productRepository.find()
    const data = products.map(product => this.formatProduct(product, req))
    return data
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
    return data
  }

  // ### getOne function ###
  async findOne(id: number, req: Request) {
    const product = await this.productRepository.findOneBy({ id })

    if (!product) {
      throw new HttpException({
        code: 'PRODUCT_NOT_FOUND', message: 'Producto no encontrado', data: null
      }, HttpStatus.NOT_FOUND)
    }
    return this.formatProduct(product, req)
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

    const { categoryId, ...Dto } = dto
    this.productRepository.merge(product, Dto)
    await this.productRepository.save(product)

    return this.formatProduct(product, req)
  }

  // ### delete function ###
  async remove(id: number) {
    const product = await this.productRepository.findOneBy({ id })

    if (!product) {
      throw new HttpException({
        code: 'PRODUCT_NOT_FOUND', message: 'Producto no encontrado', data: null
      }, HttpStatus.NOT_FOUND)
    }

    return this.productRepository.remove(product)
  }
}
