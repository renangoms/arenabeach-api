import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, MinLength } from "class-validator";

export class SignupDto {
    @IsString()
    @IsNotEmpty()
    name: string;
    
    @IsString()
    @IsNotEmpty()
    phone: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string;
}