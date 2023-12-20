import mongoose, { Document } from 'mongoose';

export interface Irole extends Document {
    role: String,
    access: {
        add: boolean,
        view: boolean,
        edit: boolean,
        delete: boolean,
    },
    permission: [String]
}
export interface Access {
        add: boolean,
        view: boolean,
        edit: boolean,
        delete: boolean
}
export interface updateRoleInput {
    id: String,
    role: String,
    access: {
        add: boolean,
        view: boolean,
        edit: boolean,
        delete: boolean,
    },
    permission: [String],
}