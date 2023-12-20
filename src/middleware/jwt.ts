import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import config from '../config/config';
import graphqlErrorHandler from '../utils/graphqlErrorHandler';
// import { Admin, Role } from '../models';

export const createToken = (payload: any) => {
    if (config && config.JWT.SECRET && config.JWT.EXPIRES_IN) {
        let expireTime = Number(config?.JWT.EXPIRES_IN)
        return jwt.sign(payload, config?.JWT.SECRET, { expiresIn: expireTime * 60 });
    }
    throw graphqlErrorHandler(httpStatus.BAD_REQUEST, 'JWT is not defined in the configuration.')
};

export const validateToken = async (token: string | any) => {
    try {
        if (config && config.JWT.SECRET && config.JWT.EXPIRES_IN) {
            const authenticationScheme = 'Bearer ';
            if (token.startsWith(authenticationScheme)) {
                token = token.slice(authenticationScheme.length, token.length);
            }
            const decode = jwt.verify(token, config.JWT.SECRET);
            return decode;
        } else {
            throw graphqlErrorHandler(httpStatus.BAD_REQUEST, 'JWT Configuration Pending')
        }
    } catch (error: any) {
        if (error?.name === 'TokenExpiredError') {
            throw graphqlErrorHandler(httpStatus.BAD_REQUEST, 'Token Expired')
        }
        throw graphqlErrorHandler(httpStatus.BAD_REQUEST, 'Invalid Token')
    }
};

export const authenticate = async (info: any, access: string, permission: string) => {
    //Admin
    if (info?.role?.role == 'Admin') {
        return true;
    }

    //check info exists or not
    if (!Object.keys(info).length) {
        throw graphqlErrorHandler(httpStatus.UNAUTHORIZED, 'unauthorized request')
    }

    //check Permission
    let checkPermission = info?.role?.permission.includes(permission);
    if (!checkPermission) {
        throw graphqlErrorHandler(httpStatus.UNAUTHORIZED, 'Permission Denied')
    }
    //check Access
    let checkAccess = false;
    Object.keys(info?.role?.access).forEach(item => {
        if (item === access) {
            checkAccess = info?.role?.access[access];
        }
    });
    if (!checkAccess) {
        throw graphqlErrorHandler(httpStatus.UNAUTHORIZED, 'Access Denied')
    }

    return true;
}