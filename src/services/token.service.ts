import jwt from 'jsonwebtoken';
import moment from 'moment';
import httpStatus from 'http-status';
import config from '../config/config';
import tokenTypes from '../config/tokens';
import { AppDataSource } from '../config/app-data-source';
import { Token } from '../models';
import graphqlErrorHandler from '../utils/graphqlErrorHandler';
const tokenRepository = AppDataSource.getRepository(Token);

const generateToken = (userId: string, expires: any, type: string, secret = config.JWT.SECRET) => {
  if (secret) {
    const payload = {
      sub: userId,
      iat: moment().unix(),
      exp: expires.unix(),
      type,
    };
    return jwt.sign(payload, secret);
  } else {
    throw graphqlErrorHandler(httpStatus.BAD_REQUEST, 'jwt configuration not setup')
  }
};

enum TokenType {
  ACCESS = 'access',
  REFRESH = 'refresh',
  RESET_PASSWORD = 'resetPassword',
  VERIFY_EMAIL = 'verifyEmail',
  INVITE_EMAIL = 'inviteEmail'
}

const saveToken = async (token: string, userId: string, expires: any, type: any) => {
  const tokenDoc = tokenRepository.create({
    token,
    expires: expires ? expires.toDate() : null,
    userId,
    type
  });
  const newToken = await tokenRepository.save(tokenDoc)
  return newToken;
};

export const verifyToken = async (token: string, type: any) => {
  if (config?.JWT.SECRET) {
    try {
      const payload = jwt.verify(token, config?.JWT.SECRET);
      const tokenDoc = await tokenRepository.findOne({
        where: {
          token,
          type,
          userId: payload.sub.toString()
        }
      });
      if (!tokenDoc) {
        throw new Error('Token not found');
      }
      return tokenDoc;
    } catch (e) {
      throw graphqlErrorHandler(httpStatus.BAD_REQUEST, 'Token Invalid / Expired')
    }
  } else {
    throw graphqlErrorHandler(httpStatus.BAD_REQUEST, 'jwt configuration not setup')
  }
};

export const generateResetPasswordToken = async (email: string, data: any) => {
  if (config) {
    const expires = moment().add(config.JWT.RESETPASSWORDEXPIRETIME, 'minutes');
    const resetPasswordToken = generateToken(data.id, expires, tokenTypes.RESET_PASSWORD);
    // if (resetPasswordToken) {
    await saveToken(resetPasswordToken, data.id, expires, tokenTypes.RESET_PASSWORD);
    return resetPasswordToken;
    // }
  } else {
    throw graphqlErrorHandler(httpStatus.BAD_REQUEST, 'jwt configuration not setup')
  }
};

export const createInviteToken = async (payload: any) => {
  if (config && config.JWT.SECRET) {
    payload.sub = payload.userId;
    let inviteToken = jwt.sign(payload, config?.JWT.SECRET);
    await saveToken(inviteToken, payload.userId, null, TokenType.INVITE_EMAIL);
    return inviteToken;
  }
  throw graphqlErrorHandler(httpStatus.BAD_REQUEST, 'JWT is not defined in the configuration.')
};

export const checkTokenExist = async (userId: string, type: any) => {
  const token: any = await tokenRepository.findOne({
    where: {
      userId,
      type,
    }
  });
  const currentTime = new Date();
  if (token && currentTime < token.expires) {
    return true;
  } else {
    await tokenRepository.delete({ userId, type })
    return false
  }
}