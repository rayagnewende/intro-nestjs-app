/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Logger, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFiltered } from './dto/get-tasks-filter.dto';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { TaskStatus } from './task.status.enum';
import { AuthGuard } from '@nestjs/passport';
import User from 'src/auth/user.entity';
import { GetUser } from 'src/auth/getUser.decorator';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    
    constructor(private tasksService:TasksService){}

    @Get()
    getTasksFiltered(
        @Query(ValidationPipe) tasksFiltered:GetTasksFiltered,
        @Req() req):Promise<Task[]>{
      return this.tasksService.getTasks(tasksFiltered, req.user); 
    }

    // @Get()
    // getAllTasks():Task[]
    // {
    //     return this.tasksService.getAllTasks();
    // }
    
    @Get('/:id')
    getTaskById(
        @Param('id') id:number,
        @Req() req
        ):Promise<Task> {
        return this.tasksService.getTaskById(id, req.user); 
    }


    @Post()
    @UsePipes(ValidationPipe)
    createTask(
        @Body() createTaskDto:CreateTaskDto,
        @Req() req) {
    return this.tasksService.createTask(createTaskDto,req.user);    
     }

    @Delete('/:id')
    deleteTask(
        @Param('id', ParseIntPipe) id:number,
        @Req() req): Promise<void>
    {
        return this.tasksService.deleteTask(id, req.user); 
    }


    @Patch('/:id/status')
    updateTask(
        @Param('id', ParseIntPipe) id:number,
        @Body('status') status:TaskStatus, 
        @Req() req):Promise<Task>{
            return this.tasksService.updateTask(id, status, req.user); 
    }
   
}
