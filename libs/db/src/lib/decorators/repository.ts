import { Type } from '@nestjs/common';

export function Repository<T>(collectionName: string): (target: Type<T>) => void {
    return (target: Type<T>) => {
        Object.defineProperty(target.prototype, 'collectionName', {
            value: collectionName,
            writable: false
        });
    }
}