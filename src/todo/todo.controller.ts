import { Body, Controller, Delete, Get, Param, Patch, Post, ValidationPipe } from '@nestjs/common';
import { CreateTodoDto } from 'src/DTO/create-todo.dto';
import { TodoStatus } from 'src/Entity/todo.entity';
import { TodoStatusValidationPipe } from 'src/pipes/todoStatusValidation.pipe';
import { TodoService } from './todo.service';

@Controller('todos')
export class TodoController {
    constructor(private todoService: TodoService) {

    }
    @Get()
    getAllTodos() {
        //console.log(this.todoService.getAllTodos()); 
        return this.todoService.getAllTodos();
    }

    @Post()
    createNewTodo(@Body(ValidationPipe) data:CreateTodoDto) {
        return this.todoService.createTodo(data);
    }

    @Patch(':id')
    updateTodo(@Body('status', TodoStatusValidationPipe) status: TodoStatus, @Param('id') id: number) {
        return this.todoService.update(id, status);
    }

    @Delete(':id')
    deleteTodo(@Param('id') id: number) {
        
        return this.todoService.delete(id);
    }
}
