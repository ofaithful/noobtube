import { ObjectId } from 'mongodb';

export class File {
    userId: ObjectId;
    location: string;
    thumbnail?: string;
    uuid?: string;
    name: string;
}