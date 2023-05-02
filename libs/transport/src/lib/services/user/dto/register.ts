import { User } from '@streams/db'

export interface RegisterUserParams {
    username: string;
    password: string;
}

export interface RegisterUserResult {
    user: User;

    token: string;
}