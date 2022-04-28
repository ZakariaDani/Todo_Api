import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTodoDto } from 'src/DTO/create-todo.dto';
import { TodoEntity, TodoStatus } from 'src/Entity/todo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TodoService {
    

    constructor(@InjectRepository(TodoEntity) private repo: Repository<TodoEntity>) {}
    //this function return a promise
    async getAllTodos(){
        return await this.repo.find();
    }

    async createTodo(data: CreateTodoDto) {
        const todo = new TodoEntity();
        const {title, description} = data;
        todo.title = title;
        todo.description = description;
        todo.status = TodoStatus.OPEN;
        this.repo.create(todo);
        //we add await because it (save method) returns a promise
        try {
            
            return await this.repo.save(todo);

        } catch (error) {
            
            throw new InternalServerErrorException('Something went wrong !');

        }
        
    }

    async update(id: number, status: TodoStatus) {
        try {

            await this.repo.update({id}, {status});
            return this.repo.findOne({id});

        } catch (error) {

            throw new InternalServerErrorException('Something went wrong !');

        }
        
    }

    async delete(id: number) {
        try {

            return await this.repo.delete({id});

        } catch (error) {

            throw new InternalServerErrorException('Something went wrong !');
            
        }
        
    }
}
