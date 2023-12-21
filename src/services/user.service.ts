import { createToken } from '../middleware/jwt';
import httpStatus from 'http-status';
import { Admin, Role } from '../models';
import graphqlErrorHandler from '../utils/graphqlErrorHandler';
import { AppDataSource } from '../config/app-data-source';
const adminRepository = AppDataSource.getRepository(Admin);

export const sendLoginResponse = (data: any) => {
    const token = createToken({
        id: data._id,
        email: data.email,
        role: data.role
    });
    return {
        status: httpStatus.OK,
        message: "Login Success",
        token,
        role: data.role
    }
}

export const getUserById = async (id: string) => {
    const adminData: any = await adminRepository.findOne({ where: { id } });
    // const customerAdminData: any = await customerAdministrator.findById({ where: { id } });
    // const customerUserData: any = await customerUser.findById({ where: { id } });

    if (adminData) {
        return adminData;
    // } else if (customerAdminData) {
    //     return customerAdminData;
    // } else if (customerUserData) {
    //     return customerUserData;
    } else {
        throw graphqlErrorHandler(httpStatus.INTERNAL_SERVER_ERROR, "No User Data Found")
    }
}