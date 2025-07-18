import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProductoDto {
    @IsString()
    name: string;

    @IsNumber()
    price: number;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    imageUrl?: string;

    @IsNumber()
    categoryId: number
}
