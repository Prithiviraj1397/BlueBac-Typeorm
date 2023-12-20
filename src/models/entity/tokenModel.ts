import mongoose, { model, Schema } from 'mongoose';
import { Itoken } from '../../interface/IToken';
import tokenTypes from '../../config/tokens'

const tokenSchema: Schema = new Schema(
    {
        token: {
            type: String,
            required: true,
            index: true,
        },
        id: {
            type: mongoose.SchemaTypes.ObjectId,
            required: true
        },
        expires: {
            type: Date
        },
        type: {
            type: String,
            enum: [tokenTypes.REFRESH, tokenTypes.RESET_PASSWORD, tokenTypes.VERIFY_EMAIL, tokenTypes.INVITE_EMAIL],
            required: true,
        }
    },
    { timestamps: true, versionKey: false }
);

export default model<Itoken>("Token", tokenSchema, "Token")