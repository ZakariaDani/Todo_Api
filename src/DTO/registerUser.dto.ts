import { IsNotEmpty, Matches, MaxLength, MinLength } from "class-validator";


export class RegisterUserDto {
    @IsNotEmpty()
    username: string;
    @IsNotEmpty()
    @MinLength(6, {message: "choose a password between 6 and 12 characters"})
    @MaxLength(12, {message: "choose a password between 6 and 12 characters"})
    password: string;
}