import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCourtDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    location: string;

    @IsNumber()
    @IsNotEmpty()
    pricePerHour: number;

    @IsBoolean()
    avaiability: boolean;
}
