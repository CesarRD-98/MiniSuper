import { IsOptional, IsString } from "class-validator";

export class CreateCategoriaDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;
}
