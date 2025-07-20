import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class CreateProductoDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    price: number;
    
    @IsOptional()
    stock: number;

    @IsOptional()
    @IsString()
    imageUrl?: string;

    @IsNumber()
    @IsNotEmpty()
    categoryId: number
}
