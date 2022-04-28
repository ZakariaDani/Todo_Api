import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";


@Entity('todos')
export class TodoEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    title: string;
    @Column()
    description: string;
    @Column()
    status:TodoStatus;

}

export enum TodoStatus {
    OPEN = "OPEN",
    WIP = "WIP",
    COMPLETED = "COMPLETED"
}