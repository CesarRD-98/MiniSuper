import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseInterceptors, UsePipes, UploadedFile, Req } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '@common/config/multer.config';
import { Request } from 'express';
import { ResponseController } from '@common/services/response/response.controller';
import { ResponseService } from '@common/services/response/response.service';

@Controller('producto')
export class ProductoController extends ResponseController {
  constructor(
    private readonly productoService: ProductoService,
    responseService: ResponseService
  ) {
    super(responseService)
  }

  @Post()
  async create(@Body() dto: CreateProductoDto) {
    const product = await this.productoService.create(dto);
    return this.success(
      'PRODUCT_CREATED', { productoId: product.id }, 'Producto creado exitosamente'
    )
  }

  @Post('imagen/:id')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async uploadImage(
    @Param('id', ParseIntPipe) id: number, @UploadedFile() file: Express.Multer.File, @Req() req: Request
  ) {
    const imgUrl = await this.productoService.updateImage(id, file.filename, req)
    return this.success(
      'IMAGE_UPDATED', { url: imgUrl }, 'Imagen actualizada exitosamente'
    )
  }

  @Get()
  async findAll(@Req() req: Request) {
    const data = await this.productoService.findAll(req);
    return this.success(
      'PRODUCTS_FOUND', data, 'Productos encontrados exitosamente'
    )
  }

  @Get('categoria/:id')
  async findByCategory(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const data = await this.productoService.findByCategory(id, req)
    return this.responseService.success(
      'PRODUCTS_BY_CATEGORY_FOUND', data, 'Productos encontrados por categoria exitosamente'
    )
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const product = await this.productoService.findOne(id, req);
    return this.success(
      'PRODUCT_FOUND', product, 'Producto encontrado exitosamente'
    )
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductoDto, @Req() req: Request) {
    const product = await this.productoService.update(id, dto, req);
    return this.success(
      'PRODUCT_UPDATED', product, 'Producto actualizado exitosamente'
    )
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.productoService.remove(id);
    return this.success(
      'PRODUCT_DELETED', null, 'Producto eliminado exitosamente'
    )
  }
}
