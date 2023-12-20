import jwt from 'jsonwebtoken';
import moment from 'moment';
import httpStatus from 'http-status';
import config from '../config/config';
import tokenTypes from '../config/tokens';
import { Token } from '../models';
import graphqlErrorHandler from '../utils/graphqlErrorHandler';

const generateToken = (id: string, expires: any, type: string, secret = config.JWT.SECRET) => {
  if (secret) {
    const payload = {
      sub: id,
      iat: moment().unix(),
      exp: expires.unix(),
      type,
    };
    return jwt.sign(payload, secret);
  }
};

const saveToken = async (token: string, Id: string, expires: any, type: string) => {
  const tokenDoc = await Token.create({
    token,
    id: Id,
    expires: expires ? expires.toDate() : null,
    type
  });
  return tokenDoc;
};

export const verifyToken = async (token: string, type: string) => {
  if (config?.JWT.SECRET) {
    try {
      const payload = jwt.verify(token, config?.JWT.SECRET);
      const tokenDoc = await Token.findOne({ token, type, id: payload.sub });
      if (!tokenDoc) {
        throw new Error('Token not found');
      }
      return tokenDoc;
    } catch (e) {
      throw graphqlErrorHandler(httpStatus.BAD_REQUEST, 'Token Invalid / Expired')
    }
  }
};

export const generateResetPasswordToken = async (email: string, data: any) => {
  if (config) {
    const expires = moment().add(config.JWT.RESETPASSWORDEXPIRETIME, 'minutes');
    const resetPasswordToken = generateToken(data._id, expires, tokenTypes.RESET_PASSWORD);
    if (resetPasswordToken) {
      await saveToken(resetPasswordToken, data.id, expires, tokenTypes.RESET_PASSWORD);
      return resetPasswordToken;
    }
  }
};

export const createInviteToken = async (payload: any) => {
  if (config && config.JWT.SECRET) {
    payload.sub = payload.id;
    let inviteToken = jwt.sign(payload, config?.JWT.SECRET);
    await saveToken(inviteToken, payload.id, null, tokenTypes.INVITE_EMAIL);
    return inviteToken;
  }
  throw graphqlErrorHandler(httpStatus.BAD_REQUEST, 'JWT is not defined in the configuration.')
};

export const checkTokenExist = async (id: string, type: string) => {
  const token: any = await Token.findOne({ id, type }).sort({ createdAt: -1 })
  const currentTime = new Date();
  if (token && currentTime < token.expires) {
      return true;
  } else {
      await Token.deleteMany({ id, type })
      return false
  }
}