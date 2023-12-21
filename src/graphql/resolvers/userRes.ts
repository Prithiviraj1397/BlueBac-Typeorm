import graphqlErrorHandler from '../../utils/graphqlErrorHandler';
import * as bcrypt from 'bcryptjs';
import catchAsync from '../../utils/catchAsync';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import { Admin, Token } from '../../models';
import config from '../../config/config';
import { AppDataSource } from '../../config/app-data-source';
import { verifyToken } from '../../services/token.service';
import { getUserById } from '../../services/user.service';

const tokenRepository = AppDataSource.getRepository(Token);
enum tokenTypes {
    ACCESS = 'access',
    REFRESH = 'refresh',
    RESET_PASSWORD = 'resetPassword',
    VERIFY_EMAIL = 'verifyEmail',
    INVITE_EMAIL = 'inviteEmail'
};
//Query Functions
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
        // login,
        // forgetPassword,
        tokenValidate
    },
    Mutation: {
        // resetPassword,
        inviteResetPassward
    }

}
