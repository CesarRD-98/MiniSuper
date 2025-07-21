import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseInterceptors, UsePipes, UploadedFile, Req } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '@common/config/multer.config';
import { Request } from 'express';

@Controller('producto')
export class ProductoController {
  constructor(
    private readonly productoService: ProductoService
  ) { }

  @Post()
  async create(@Body() dto: CreateProductoDto) {
    return await this.productoService.create(dto);
  }

  @Post('imagen/:id')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async uploadImage(
    @Param('id', ParseIntPipe) id: number, @UploadedFile() file: Express.Multer.File, @Req() req: Request
  ) {
    return this.productoService.updateImage(id, file.filename, req)
  }

  @Get()
  async findAll(@Req() req: Request) {
    return this.productoService.findAll(req);
  }

  @Get('categoria/:id')
  async findByCategory(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.productoService.findByCategory(id, req)
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.productoService.findOne(id, req);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductoDto, @Req() req: Request) {
    return this.productoService.update(id, dto, req);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.productoService.remove(id);
  }
}
