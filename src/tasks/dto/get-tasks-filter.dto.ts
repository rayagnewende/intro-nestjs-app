/* eslint-disable prettier/prettier */
import { IsIn, IsOptional } from "class-validator";
import { TaskStatus } from "../task.status.enum";
export class GetTasksFiltered {
   @IsOptional()
    @IsIn([TaskStatus.DONE, TaskStatus.IN_PROCESS, TaskStatus.OPEN])
    status:TaskStatus; 

    @IsOptional()
    search:string
}