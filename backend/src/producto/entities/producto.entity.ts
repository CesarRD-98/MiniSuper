import { Categoria } from "@categoria/entities/categoria.entity";
import { Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export class Producto {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column()
    stock: number;

    @Column({ nullable: true })
    imageUrl: string;

    @ManyToOne(() => Categoria, category => category.products, { eager: true })
    category: Categoria;
}
