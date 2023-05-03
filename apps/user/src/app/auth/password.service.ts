import { Injectable } from '@nestjs/common';
import { User } from '@streams/db';
import { pbkdf2, randomBytes } from 'crypto';

export const SAULT_SIZE = 16;
export const KEY_LENGTH = 64;
export const ITERATIONS = 10000;

@Injectable()
export class PasswordService {

    makeSalt(): Promise<string> {
        return new Promise<string>((res, rej) => {
            randomBytes(SAULT_SIZE, (err, salt) => {
                if (err) {
                    return rej(err);
                }

                return res(salt.toString('base64'));
            });
        });
    }

    hashPassword(salt: string, password: string): Promise<string> {
        return new Promise<string>((res, rej) => {
            pbkdf2(password, salt, ITERATIONS, KEY_LENGTH, 'sha1', (err, derivedKey) => {
                if (err) {
                    return rej(err);
                }

                return res(derivedKey.toString('base64'));
            });
        });
    }

    async isPasswordCorrect(user: User, password: string): Promise<boolean> {
        const hashed = await this.hashPassword(user.salt, password);
        return hashed === user.password;
    }
}