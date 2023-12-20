import { Document, Types } from "mongoose"

export interface Iadmin extends Document {
    username: String,
    email: String,
    password: String,
    type: String,
    role: Types.ObjectId
}

export interface loginInput {
    username: String,
    password: String
}

export interface createSubadminInput {
    username: String,
    email: String,
    type: String,
    role: Types.ObjectId
}

export interface createCustomerUserInput {
    username: String,
    email: String,
    administrator: String
}

export interface createCustomerAdminInput {
    username: String,
    email: String,
}
