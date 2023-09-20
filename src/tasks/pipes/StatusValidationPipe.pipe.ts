/* eslint-disable prettier/prettier */
import {  BadRequestException, PipeTransform } from "@nestjs/common";
import { TaskStatus } from "../task.status.enum";

export class StatusValidationPipe implements PipeTransform {

    readonly allowValues = [
        TaskStatus.DONE, 
        TaskStatus.IN_PROCESS,
        TaskStatus.OPEN
    ]; 
    
    transform(value: any) {
       if(!this.isValidStatusValue(value))
       {
           throw new BadRequestException(`${value} is an invalid status`); 
       }


       return value; 
    }


    private isValidStatusValue(status:any)
   {
        const idx = this.allowValues.indexOf(status); 
        return idx !== -1 ; 
   } 
    
}