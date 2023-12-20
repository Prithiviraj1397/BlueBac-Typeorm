import { model, Schema, Types } from 'mongoose';
import { Iadmin } from '../../interface/IAdmin'
import bcrypt from 'bcryptjs';
import Validator from 'validator';
import httpStatus from 'http-status';
import graphqlErrorHandler from '../../utils/graphqlErrorHandler';

const customerUserSchema: Schema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        validate(value: any) {
            if (!Validator.isEmail(value)) {
                throw graphqlErrorHandler(httpStatus.INTERNAL_SERVER_ERROR, "Please provide valid email")
            }
        },
    },
    password: {
        type: String
    },
    status: {
        type: Boolean,
        default: false
    },
    administrator: {
        type: Types.ObjectId,
        ref: 'Customer Administrator',
        required: true
    }
}, { timestamps: true, versionKey: false })

customerUserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

customerUserSchema.methods.comparePassword = async function (enteredPassword: any) {
    return await bcrypt.compare(enteredPassword, this.password);
}

export default model<Iadmin>("Customer User", customerUserSchema, "Customer User")