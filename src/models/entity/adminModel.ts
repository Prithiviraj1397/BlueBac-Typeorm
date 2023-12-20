import { model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import Validator from 'validator';
import httpStatus from 'http-status';
import { Iadmin } from '../../interface/IAdmin'
import graphqlErrorHandler from '../../utils/graphqlErrorHandler';

const adminSchema: Schema = new Schema({
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
                throw graphqlErrorHandler(httpStatus.BAD_REQUEST, "Please provide valid email")
            }
        },
    },
    password: {
        type: String,
        // required: true
    },
    type: {
        type: String,
        enum: ['admin', 'subadmin'],
        required: true
    },
    status: {
        type: Boolean,
        default: false
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: 'Role',
        required: true
    },
}, { timestamps: true, versionKey: false })

adminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

adminSchema.methods.comparePassword = async function (enteredPassword: any) {
    return await bcrypt.compare(enteredPassword, this.password);
}

export default model<Iadmin>("Admin", adminSchema, "Admin")