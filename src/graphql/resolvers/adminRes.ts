import graphqlErrorHandler from '../../utils/graphqlErrorHandler';
import { loginInput, createSubadminInput, createCustomerUserInput, createCustomerAdminInput } from '../../interface/IAdmin';
import catchAsync from '../../utils/catchAsync';
import { createToken } from '../../middleware/jwt';
import { authenticate } from '../../middleware/jwt';
import httpStatus from 'http-status';
import { Admin, Role, customerAdministrator, customerUser } from '../../models';
import Validator from 'validator';
import { createInviteToken } from '../../services/token.service';
import { sendInviteEmail } from '../../services/email.service';

//Query Functions
const getAllAdmin = async (_: any, { index, limit }: { index: number, limit: number }, context: any) => {
    let { info } = context;
    if (await authenticate(info, 'view', 'Admin')) {
        const startIndex = (index - 1) * limit;
        const authData: any = await Admin.find({ type: { $ne: 'admin' } }, { password: 0 }).populate('role').skip(startIndex).limit(limit);
        const count = await Admin.find({ type: { $ne: 'admin' } }).countDocuments();
        return {
            total: count,
            page: index,
            pageSize: limit,
            data: authData
        }
    }
}

//Mutation Functions
const createSubadmin = async (_: any, { Input }: { Input: createSubadminInput }, context: any) => {
    let { info } = context;
    if (await authenticate(info, 'add', 'Admin')) {
        let adminData = await Admin.findOne({ email: Input.email });
        if (adminData) {
            throw graphqlErrorHandler(httpStatus.BAD_REQUEST, 'Email already exists');
        }
        let roleData = await Role.findById(Input.role);
        if (!roleData) {
            throw graphqlErrorHandler(httpStatus.BAD_REQUEST, 'Role Not Found');
        }
        const data: any = await Admin.create({ ...Input });
        let token = await createInviteToken({ id: data.id, email: data.email });
        if (token) {
            await sendInviteEmail(data.email, token);
        }
        const newSubadmin: any = await Admin.findOne({ email: data.email }).populate('role');
        return {
            status: true,
            message: 'Subadmin Invite Mail Sent successfullly',
            data: newSubadmin
        }
    }
}

const createCustomerAdmin = async (_: any, { Input }: { Input: createCustomerAdminInput }, context: any) => {
    let { info } = context;
    if (await authenticate(info, 'add', 'Admin')) {
        let customerAdminData = await customerAdministrator.findOne({ email: Input.email });
        if (customerAdminData) {
            throw graphqlErrorHandler(httpStatus.BAD_REQUEST, 'Email already exists');
        }
        const data: any = (await customerAdministrator.create({ ...Input }));
        let token = await createInviteToken({ id: data.id, email: data.email });
        if (token) {
            await sendInviteEmail(data.email, token);
        }
        return {
            status: true,
            message: 'Customer Admin Invite Mail Sent successfullly',
            data
        }
    }
}

const createCustomerUser = async (_: any, { Input }: { Input: createCustomerUserInput }, context: any) => {
    let { info } = context;
    if (await authenticate(info, 'add', 'Admin')) {
        let customerUserData = await customerUser.findOne({ email: Input.email });
        if (customerUserData) {
            throw graphqlErrorHandler(httpStatus.BAD_REQUEST, 'Email already exists');
        }
        let customerAdminData = await customerAdministrator.findById(Input.administrator);
        if (!customerAdminData) {
            throw graphqlErrorHandler(httpStatus.BAD_REQUEST, 'Customer Administrator Not Found');
        }
        const data: any = await customerUser.create({ ...Input });
        let token = await createInviteToken({ id: data.id, email: data.email });
        if (token) {
            await sendInviteEmail(data.email, token);
        }
        let newCustomerUser = await customerUser.findOne({ email: data.email }).populate('administrator');
        return {
            status: true,
            message: 'Customer User Invite Mail Sent successfullly',
            data: newCustomerUser
        }
    }
}

const deleteAdmin = async (_: any, { id }: { id: string }, context: any) => {
    let { info } = context;
    if (await authenticate(info, 'delete', 'Admin')) {
        const deleteData = await Admin.deleteOne({ _id: id });
        if (deleteData.deletedCount) {
            return {
                status: 200,
                message: 'Admin data deleted successfully'
            }
        } else {
            throw graphqlErrorHandler(httpStatus.BAD_REQUEST, 'Admin data deleted failed!');
        }
    }
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