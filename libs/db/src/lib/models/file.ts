import { ObjectId } from 'mongodb';

export class File {
    userId: ObjectId;
    location: string;

    name: string;
}