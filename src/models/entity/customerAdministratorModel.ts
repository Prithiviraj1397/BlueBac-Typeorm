import { model, Schema } from 'mongoose';
import { Iadmin } from '../../interface/IAdmin'
import bcrypt from 'bcryptjs';
import Validator from 'validator';
import httpStatus from 'http-status';
import graphqlErrorHandler from '../../utils/graphqlErrorHandler';


const customerAdministratorSchema: Schema = new Schema({
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
    }
}, { timestamps: true, versionKey: false })

customerAdministratorSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

customerAdministratorSchema.methods.comparePassword = async function (enteredPassword: any) {
    return await bcrypt.compare(enteredPassword, this.password);
}

export default model<Iadmin>("Customer Administrator", customerAdministratorSchema, "Customer Administrator")