import { Column, PrimaryGeneratedColumn } from "typeorm";

export class Usuario {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({unique: true})
    email: string;
    
    @Column()
    password: string;

    @Column()
    role: 'cliente' | 'admin';

    @Column()
    createdAt: Date;
}
