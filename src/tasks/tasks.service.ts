/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task.status.enum';
import { GetTasksFiltered } from './dto/get-tasks-filter.dto';
import User from 'src/auth/user.entity';

@Injectable()
export class TasksService {

   
    constructor( 
        @InjectRepository(Task)
        private userRepository:Repository<Task>
        ){}

   
 async getTasks(tasksFiltered:GetTasksFiltered, user:User):Promise<Task[]> {
        const { status, search } = tasksFiltered;
    
        const query = this.userRepository.createQueryBuilder('task');
    
        query.where('task.userId = :userId', {userId:user.id}); 

        if(status)
        {
             query.andWhere('task.status = :status', {status}); 
        }
        if(search)
        {
             query.andWhere('task.title LIKE :search OR task.description LIKE :search', {search:`%${search}%`}); 
        }
        const tasks = await query.getMany();
        return tasks;
 }


 
async getTaskById(id:number,user:User): Promise<Task> {

    const found = await this.userRepository.findOne({
      where : {
        id, 
        userId : user.id 
      }
    });

    if( !found)
        {
           throw new NotFoundException('Task with ID'); 
        }else {
            return found; 
        }
}

async createTask(createTaskDto:CreateTaskDto, user:User) : Promise<Task> {
  const { title, description} = createTaskDto ; 

  const task = new Task(); 
  task.title = title; 
  task.description = description; 
  task.status = TaskStatus.OPEN ; 
  task.user = user; 
   await task.save(); 
   return task; 
}

   
   async deleteTask(id:number, user:User):Promise<void> {
     
    const found = await this.userRepository.delete({ id, userId:user.id}); 

   if(found.affected === 0)
   {
     throw new NotFoundException(`Task with id: ${id} is not found`); 
   }

   }

   async updateTask(id:number,status:TaskStatus, user:User):Promise<Task>{
    const task = await this.getTaskById(id, user); 

    task.status = status; 
     await task.save(); 
     return task ; 
   }


}
