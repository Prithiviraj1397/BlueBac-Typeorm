import graphqlErrorHandler from '../../utils/graphqlErrorHandler';
import { createCustomerAdminInput, createCustomerUserInput, createSubadminInput } from '../../interface/IAdmin';
import catchAsync from '../../utils/catchAsync';
import { createToken } from '../../middleware/jwt';
import { authenticate } from '../../middleware/jwt';
import httpStatus from 'http-status';
import { Admin, CustomerAdministrator, CustomerUser, Role } from '../../models';
import { AppDataSource } from '../../config/app-data-source';
import { createInviteToken } from '../../services/token.service';
import { sendInviteEmail } from '../../services/email.service';
const adminRepository = AppDataSource.getRepository(Admin);
const roleRepository = AppDataSource.getRepository(Role);
const customerAdminRepository = AppDataSource.getRepository(CustomerAdministrator);
const customerUserRepository = AppDataSource.getRepository(CustomerUser);

//Query Functions
const getAllAdmin = async (_: any, { index, limit }: { index: number, limit: number }, context: any) => {
    // let { info } = context;
    // if (await authenticate(info, 'view', 'Admin')) {
    const startIndex: number = (index - 1) * limit;
    const doc = await adminRepository.find({
        skip: startIndex,
        take: limit,
        relations: {
            role: true
        }
    });
    const count = await adminRepository.count();
    return {
        total: count,
        page: index,
        pageSize: limit,
        data: doc
    }
    // }
}

//Mutation Functions
const createSubadmin = async (_: any, { username, email, type, role }: { username: string, email: string, type: string, role: string }, context: any) => {

    // let { info } = context;
    // if (await authenticate(info, 'add', 'Admin')) {
    let adminData = await adminRepository.findOne({ where: { email } });
    if (adminData) {
        throw graphqlErrorHandler(httpStatus.BAD_REQUEST, 'Email already exists');
    }
    let roleData = await roleRepository.findOneBy({ id: role });
    if (!roleData) {
        throw graphqlErrorHandler(httpStatus.BAD_REQUEST, 'Role Not Found');
    }
    const data = adminRepository.create({ username, email, type, role: roleData });
    const newSubadmin: any = await adminRepository.save(data);
    let token = await createInviteToken({ userId: newSubadmin.id, email: data.email });
    console.log("🚀 ~ file: adminRes.ts:50 ~ createSubadmin ~ token:", token)
    if (token) {
        await sendInviteEmail(data.email, token);
    }
    return {
        status: true,
        message: 'Subadmin Invite Mail Sent successfullly',
        data: newSubadmin
    }
    // }
}

const createCustomerAdmin = async (_: any, { Input }: { Input: createCustomerAdminInput }, context: any) => {
    // let { info } = context;
    // if (await authenticate(info, 'add', 'Admin')) {
    let customerAdminData = await customerAdminRepository.findOne({ where: { email: Input.email } });
    if (customerAdminData) {
        throw graphqlErrorHandler(httpStatus.BAD_REQUEST, 'Email already exists');
    }
    const data = customerAdminRepository.create({ ...Input });
    let newCusAdm = await customerAdminRepository.save(data);

    let token = await createInviteToken({ userId: newCusAdm.id, email: data.email });
    if (token) {
        await sendInviteEmail(data.email, token);
    }
    return {
        status: true,
        message: 'Customer Admin Invite Mail Sent successfullly',
        data
    }
    // }
}

const createCustomerUser = async (_: any, { Input }: { Input: createCustomerUserInput }, context: any) => {
    // let { info } = context;
    // if (await authenticate(info, 'add', 'Admin')) {
    let customerUserData = await customerUserRepository.findOne({ where: { email: Input.email } });
    if (customerUserData) {
        throw graphqlErrorHandler(httpStatus.BAD_REQUEST, 'Email already exists');
    }

    let customerAdminData = await customerAdminRepository.findOne({
        where: {
            id: Input.administrator
        }
    });
    if (!customerAdminData) {
        throw graphqlErrorHandler(httpStatus.BAD_REQUEST, 'Customer Administrator Not Found');
    }
    Input.administrator = customerAdminData;
    const data = customerUserRepository.create({ ...Input });
    let newCustomerUser = await customerUserRepository.save(data);

    let token = await createInviteToken({ userId: newCustomerUser.id, email: data.email });
    if (token) {
        await sendInviteEmail(data.email, token);
    }

    return {
        status: true,
        message: 'Customer User Invite Mail Sent successfullly',
        data: newCustomerUser
    }
    // }
}

const deleteAdmin = async (_: any, { id }: { id: string }, context: any) => {
    // let { info } = context;
    // if (await authenticate(info, 'delete', 'Admin')) {
    const deleteData = await adminRepository.delete(id);
    if (deleteData) {
        return {
            status: 200,
            message: 'Admin data deleted successfully'
        }
    } else {
        throw graphqlErrorHandler(httpStatus.BAD_REQUEST, 'Admin data deleted failed!');
    }
    // }
}

export default {
    Query: {
        getAllAdmin
    },
    Mutation: {
        createSubadmin,
        createCustomerAdmin,
        createCustomerUser,
        deleteAdmin
    }
}