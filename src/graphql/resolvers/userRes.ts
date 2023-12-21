import graphqlErrorHandler from '../../utils/graphqlErrorHandler';
import * as bcrypt from 'bcryptjs';
import catchAsync from '../../utils/catchAsync';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import { Admin, CustomerAdministrator, CustomerUser, Token } from '../../models';
import config from '../../config/config';
import { AppDataSource } from '../../config/app-data-source';
import { checkTokenExist, generateResetPasswordToken, verifyToken } from '../../services/token.service';
import { getUserById, sendLoginResponse } from '../../services/user.service';
import { sendResetPasswordEmail } from '../../services/email.service';
const adminRepository = AppDataSource.getRepository(Admin);
const customerAdminRepository = AppDataSource.getRepository(CustomerAdministrator);
const customerUserRepository = AppDataSource.getRepository(CustomerUser);
const tokenRepository = AppDataSource.getRepository(Token);

enum tokenTypes {
    ACCESS = 'access',
    REFRESH = 'refresh',
    RESET_PASSWORD = 'resetPassword',
    VERIFY_EMAIL = 'verifyEmail',
    INVITE_EMAIL = 'inviteEmail'
};
//Query Functions
const login = async (_: any, { email, password }: { email: string, password: string }, context: any) => {
    //Admin and Subadmin
    const adminData: any = await adminRepository.findOne({ where: { email }, relations: { role: true } })
    if (adminData && await adminData.comparePassword(password)) {
        return sendLoginResponse(adminData)
    }
    //customer administrator
    const customerAdminData: any = await customerAdminRepository.findOne({ where: { email } })
    if (customerAdminData && await customerAdminData.comparePassword(password)) {
        return sendLoginResponse(customerAdminData)
    }
    //customer user
    const customerUserData: any = await customerUserRepository.findOne({ where: { email } })
    if (customerUserData && await customerUserData.comparePassword(password)) {
        return sendLoginResponse(customerUserData)
    }

    throw graphqlErrorHandler(httpStatus.BAD_REQUEST, "Invalid Email or Password");

}

const forgetPassword = async (_: any, { email }: { email: string }, context: any) => {
    const adminData: any = await adminRepository.findOne({ where: { email } });
    const customerAdminData: any = await customerAdminRepository.findOne({ where: { email } });
    const customerUserData: any = await customerUserRepository.findOne({ where: { email } });

    if (!adminData && !customerAdminData && !customerUserData) {
        throw graphqlErrorHandler(httpStatus.BAD_REQUEST, 'No users found with this email')
    }

    let tokenExists;
    if (adminData) {
        tokenExists = await checkTokenExist(adminData.id, 'resetPassword');
    } else if (customerAdminData) {
        tokenExists = await checkTokenExist(customerAdminData.id, 'resetPassword');
    } else {
        tokenExists = await checkTokenExist(customerUserData.id, 'resetPassword');
    }

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
            const tokenDoc = await tokenRepository.findOne({
                where: {
                    token,
                    // type,
                    userId: payload.sub.toString()
                }
            });
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
    } else {
        throw graphqlErrorHandler(httpStatus.BAD_GATEWAY, 'Jwt configuration not setup')
    }
}

//Mutation Functions

const resetPassword = async (_: any, { token, password }: { token: string, password: string }, context: any) => {
    const resetPasswordTokenDoc = await verifyToken(token, tokenTypes.RESET_PASSWORD);
    if (resetPasswordTokenDoc) {
        const user: any = await getUserById(resetPasswordTokenDoc?.userId);
        Object.assign(user, { password: await bcrypt.hash(password, 10) });
        await user.save();
        await tokenRepository.delete({ userId: user.id, type: resetPasswordTokenDoc.type });
        return {
            status: true,
            message: 'Password has been changed successfully'
        }
    } else {
        throw graphqlErrorHandler(httpStatus.BAD_REQUEST, "Invalid Token")
    }
}

const inviteResetPassward = async (_: any, { token, password }: { token: string, password: string }, context: any) => {
    const invitePasswordTokenDoc = await verifyToken(token, tokenTypes.INVITE_EMAIL);
    if (invitePasswordTokenDoc) {
        const user: any = await getUserById(invitePasswordTokenDoc?.userId);
        Object.assign(user, { status: true, password: await bcrypt.hash(password, 10) });
        await user.save();
        await tokenRepository.delete({ userId: user.id, type: invitePasswordTokenDoc.type });
        return {
            status: true,
            message: 'Password has been changed successfully'
        }
    } else {
        throw graphqlErrorHandler(httpStatus.BAD_REQUEST, "Invalid Token")
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
