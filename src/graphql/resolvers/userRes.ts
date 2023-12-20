import graphqlErrorHandler from '../../utils/graphqlErrorHandler';
import catchAsync from '../../utils/catchAsync';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import { Admin, customerAdministrator, customerUser, Token } from '../../models';
import Validator from 'validator';
import { checkTokenExist, generateResetPasswordToken, verifyToken } from '../../services/token.service';
import { sendResetPasswordEmail } from '../../services/email.service';
import tokenTypes from '../../config/tokens';
import { sendLoginResponse, getUserById } from '../../services/user.service';
import config from '../../config/config';

//Query Functions
const login = async (_: any, { email, password }: { email: string, password: string }, context: any) => {
    //Admin and Subadmin
    const adminData: any = await Admin.findOne({ email }).populate('role');
    if (adminData && await adminData.comparePassword(password)) {
        return sendLoginResponse(adminData)
    }
    //customer administrator
    const customerAdminData: any = await customerAdministrator.findOne({ email })
    // .populate('role');
    if (customerAdminData && await customerAdminData.comparePassword(password)) {
        return sendLoginResponse(customerAdminData)
    }
    //customer user
    const customerUserData: any = await customerUser.findOne({ email })
    // .populate('role');
    if (customerUserData && await customerUserData.comparePassword(password)) {
        return sendLoginResponse(customerUserData)
    }

    throw graphqlErrorHandler(httpStatus.BAD_REQUEST, "Invalid Email or Password");

}

const forgetPassword = async (_: any, { email }: { email: string }, context: any) => {
    const adminData: any = await Admin.findOne({ email });
    const customerAdminData: any = await customerAdministrator.findOne({ email });
    const customerUserData: any = await customerUser.findOne({ email });

    if (!adminData && !customerAdminData && !customerUserData) {
        throw graphqlErrorHandler(httpStatus.BAD_REQUEST, 'No users found with this email')
    }

    let tokenExists = await checkTokenExist(adminData._id, 'resetPassword')
    if (tokenExists) {
        return { status: false, message: 'Reset password link has already sent to your email address' }
    }

    let resetPasswordToken;
    if (adminData) {
        resetPasswordToken = await generateResetPasswordToken(email, adminData);
    } else if (customerAdminData) {
        resetPasswordToken = await generateResetPasswordToken(email, customerAdminData);
    } else {
        resetPasswordToken = await generateResetPasswordToken(email, customerUserData);
    }

    if (resetPasswordToken) {
        await sendResetPasswordEmail(email, resetPasswordToken);
    }

    return {
        status: true,
        message: 'Reset password link has been sent to your email address'
    }
}

const tokenValidate = async (_: any, { token }: { token: string }, context: any) => {
    if (config?.JWT.SECRET) {
        try {
            const payload = jwt.verify(token, config?.JWT.SECRET);
            const type = tokenTypes.RESET_PASSWORD;
            const tokenDoc = await Token.findOne({ token, type, id: payload.sub });
            if (!tokenDoc) {
                return {
                    status: false,
                    message: 'Token not found'
                }
            }
            return {
                status: true,
                message: 'Token is valid'
            }
        } catch (e) {
            return {
                status: false,
                message: 'Token Invalid / Expired'
            }
        }
    }
}

const resetPassword = async (_: any, { token, password }: { token: string, password: string }, context: any) => {
    const resetPasswordTokenDoc = await verifyToken(token, tokenTypes.RESET_PASSWORD);
    if (resetPasswordTokenDoc) {
        const user: any = await getUserById(resetPasswordTokenDoc?.id);
        Object.assign(user, { password });
        await user.save();
        await Token.deleteMany({ id: user.id, type: tokenTypes.RESET_PASSWORD });
        return {
            status: true,
            message: 'Password has been changed successfully'
        }
    }
}

const inviteResetPassward = async (_: any, { token, password }: { token: string, password: string }, context: any) => {
    const invitePasswordTokenDoc = await verifyToken(token, tokenTypes.INVITE_EMAIL);
    if (invitePasswordTokenDoc) {
        const user: any = await getUserById(invitePasswordTokenDoc?.id);
        Object.assign(user, { status: true, password });
        await user.save();
        await Token.deleteMany({ id: user.id, type: tokenTypes.INVITE_EMAIL });
        return {
            status: true,
            message: 'Password has been changed successfully'
        }
    }
}

export default {
    Query: {
        login,
        forgetPassword,
        tokenValidate
    },
    Mutation: {
        resetPassword,
        inviteResetPassward
    }

}