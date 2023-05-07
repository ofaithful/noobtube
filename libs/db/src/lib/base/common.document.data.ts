import { ObjectId } from 'mongodb';

type MongoDocumentData = {
    _id: ObjectId;
    
    created_at?: Date;

    updated_at?: Date;

    deleted_at?: Date;
}

export type CommonDocumentData<T> = T & MongoDocumentData;