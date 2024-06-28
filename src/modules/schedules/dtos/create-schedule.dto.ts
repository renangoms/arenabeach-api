import { IsEnum, IsNotEmpty, IsNumber } from "class-validator";
import { DayOfWeek } from "../entities/Schedule";

export class CreateScheduleDto {
    @IsEnum(DayOfWeek)
    @IsNotEmpty()
    dayOfWeek: DayOfWeek;

    @IsNumber()
    @IsNotEmpty()
    startTime: number;

    @IsNumber()
    @IsNotEmpty()
    endTime: number;
}
