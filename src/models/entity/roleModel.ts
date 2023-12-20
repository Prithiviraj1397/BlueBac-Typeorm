import mongoose, { model, Schema } from 'mongoose';
import { Irole } from '../../interface/IRole';

const postSchema: Schema = new Schema({
    role: {
        type: String,
        unique: true,
        index: true,
        require: true
    },
    access: {
        add: {
            type: Boolean,
            require: true
        },
        view: {
            type: Boolean,
            require: true
        },
        edit: {
            type: Boolean,
            require: true
        },
        delete: {
            type: Boolean,
            require: true
        }
    },
    permission: {
        type: [String],
        default: []
    }

}, { timestamps: true, versionKey: false })

export default model<Irole>("Role", postSchema, "Role")