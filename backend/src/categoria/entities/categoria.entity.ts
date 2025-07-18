import { Producto } from "@producto/entities/producto.entity";
import { Column, OneToMany, PrimaryGeneratedColumn } from "typeorm";

export class Categoria {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @OneToMany(() => Producto, product => product.category)
    products: Producto[]
}
