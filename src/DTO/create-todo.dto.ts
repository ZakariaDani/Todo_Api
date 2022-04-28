import { IsNotEmpty, MaxLength } from "class-validator";



export class CreateTodoDto {
    @IsNotEmpty()
    @MaxLength(15, {message: 'Max length is 15 caracters'})
    title: string;
    @IsNotEmpty()
    description: string;
}