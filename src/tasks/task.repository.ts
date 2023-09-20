import { EntityRepository, Repository } from 'typeorm';
import { Task } from './task.entity';
import { GetTasksFiltered } from './dto/get-tasks-filter.dto';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {}
