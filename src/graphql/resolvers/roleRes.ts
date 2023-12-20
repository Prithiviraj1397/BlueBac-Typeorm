// import graphqlErrorHandler from '../../utils/graphqlErrorHandler';
// import { Entity } from '../../models';
import { Access, updateRoleInput } from '../../interface/IRole';
// import { authenticate } from '../../middleware/jwt';
// // import catchAsync from '../../utils/catchAsync';
// import httpStatus from 'http-status';

//Query Functions
const getAllrole = async (_: any, { index, limit }: { index: number, limit: number }, context: any) => {
    // let { info } = context;
    // if (await authenticate(info, 'view', 'Role')) {
    //     const startIndex: any = (index - 1) * limit;
    //     const doc = await Role.find({ role: { $ne: 'Admin' } }).sort({ _id: -1 }).limit(limit).skip(parseInt(startIndex));
    //     const count = await Role.find({ role: { $ne: 'Admin' } }).countDocuments();
    //     return {
    //         total: count,
    //         page: index,
    //         pageSize: limit,
    //         data: doc
    //     }
    // }
}

//Mutation Functions
const createRole = async (_: any, { role, access, permission }: { role: string, access: Access, permission: [string] }, context: any) => {
    // let { info } = context;
    // if (await authenticate(info, 'add', 'Role')) {
    //     const roleExist = await Role.findOne({ role })
    //     if (roleExist) {
    //         throw graphqlErrorHandler(httpStatus.BAD_REQUEST, 'Role data already Exist!')
    //     }
    //     const newRole = await Role.create({ role, access, permission });
    //     return {
    //         status: true,
    //         message: 'Role data created successfully!',
    //         data: newRole
    //     }
    // }
}

const updateRole = async (_: any, { Input }: { Input: updateRoleInput }, context: any) => {
    // let { info } = context;
    // if (await authenticate(info, 'edit', 'Role')) {
    //     const { id }: any = Input;
    //     const updateRole = await Role.findOneAndUpdate(
    //         { _id: id },
    //         { $set: { ...Input } },
    //         { new: true }
    //     )
    //     if (updateRole) {
    //         return {
    //             status: true,
    //             message: 'Role updated successfully!',
    //             data: updateRole
    //         }
    //     } else {
    //         throw graphqlErrorHandler(httpStatus.BAD_REQUEST, 'Role updated failed!');
    //     }
    // }
}

const deleteRole = async (_: any, { id }: { id: string }, context: any) => {
    // let { info } = context;
    // if (await authenticate(info, 'delete', 'Role')) {
    //     const deleteData = await Role.deleteOne({ _id: id });
    //     if (deleteData.deletedCount) {
    //         return {
    //             status: 200,
    //             message: 'Role deleted successfully'
    //         }
    //     } else {
    //         throw graphqlErrorHandler(httpStatus.BAD_REQUEST, 'Role deleted failed!');
    //     }
    // }
}

export default {
    Query: {
        getAllrole
    },
    Mutation: {
        createRole,
        updateRole,
        deleteRole
    },
}