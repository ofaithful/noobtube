import { ObjectId } from 'mongodb';

export type CommonMongoDocumentData = {
    id: string;

    _id: ObjectId;

    created_at: Date;

    updated_at: Date;

    deleted_at?: Date;
}

export type WithCommonDocumentData<TDoc> = TDoc & CommonMongoDocumentData;