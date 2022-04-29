import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTodoDto } from 'src/DTO/create-todo.dto';
import { TodoEntity, TodoStatus } from 'src/Entity/todo.entity';
import { UserEntity } from 'src/Entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TodoService {
    

    constructor(@InjectRepository(TodoEntity) private repo: Repository<TodoEntity>) {}
    //this function return a promise
    async getAllTodos(user: UserEntity){
        const query = await this.repo.createQueryBuilder('todo');
        query.where(`todo.userId = :userId`, {userId: user.id});

        try {
            return query.getMany();
        } catch (error) {
            throw new NotFoundException('no todos found');
        }
    }

    async createTodo(data: CreateTodoDto, user:UserEntity) {
        const todo = new TodoEntity();
        const {title, description} = data;
        todo.title = title;
        todo.description = description;
        todo.status = TodoStatus.OPEN;
        todo.userId = user.id;
        this.repo.create(todo);
        //we add await because it (save method) returns a promise
        try {
            
            return await this.repo.save(todo);

        } catch (error) {
            
            throw new InternalServerErrorException('Something went wrong !');

        }
        
    }

    async update(id: number, status: TodoStatus, user: UserEntity) {
        try {

            await this.repo.update({id, userId: user.id}, {status});
            return this.repo.findOne({id});

        } catch (error) {

            throw new InternalServerErrorException('Something went wrong !');

        }
        
    }

    async delete(id: number, user: UserEntity) {
        const result = await this.repo.delete({id, userId: user.id});
        if (result.affected === 0) {
            throw new NotFoundException('todo not deleted');
        }
        else{
            return {success: true};
        }
    }
}
