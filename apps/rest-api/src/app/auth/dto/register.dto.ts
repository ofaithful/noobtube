import { User } from '@streams/db';
import { IsString } from 'class-validator';

export class RegisterDto {
    @IsString()
    username: string;

    @IsString()
    password: string;
}

export class RegisterResultDto {
    user: User;

    token: string;
}
