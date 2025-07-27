import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Usuario {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({unique: true})
    email: string;
    
    @Column()
    password: string;

    @Column({default: 'cliente'})
    role: 'cliente' | 'admin';

    @CreateDateColumn()
    createdAt: Date;
}
