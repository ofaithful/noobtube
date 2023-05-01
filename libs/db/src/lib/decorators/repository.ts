import { Type } from '@nestjs/common';

export function Repository<T>(collectionName: string) {
    return (target: Type<T>) => {
        Object.defineProperty(target.prototype, 'collectionName', {
            value: collectionName,
            writable: false
        });
    }
}