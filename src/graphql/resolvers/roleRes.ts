import graphqlErrorHandler from '../../utils/graphqlErrorHandler';
import { AppDataSource } from '../../config/app-data-source';
import { Role } from '../../models';
import { Access } from '../../interface/IRole';
// import { authenticate } from '../../middleware/jwt';
import catchAsync from '../../utils/catchAsync';
import httpStatus from 'http-status';
const roleRepository = AppDataSource.getRepository(Role);
//Query Functions
const getAllrole = async (_: any, { index, limit }: { index: number, limit: number }, context: any) => {
    let { info } = context;
    // if (await authenticate(info, 'view', 'Role')) {
    const startIndex: number = (index - 1) * limit;
    const doc = await roleRepository.find({
        skip: startIndex,
        take: limit,
    });
    const count = await roleRepository.count();
    return {
        total: count,
        page: index,
        pageSize: limit,
        data: doc
    }
    // }
}

//Mutation Functions
const createRole = async (_: any, { role, access, permission }: { role: string, access: Access, permission: [string] }, context: any) => {
    // let { info } = context;
    // if (await authenticate(info, 'add', 'Role')) {
    const roleExist = await roleRepository.findOne({ where: { role } })
    if (roleExist) {
        throw graphqlErrorHandler(httpStatus.BAD_REQUEST, 'Role data already Exist!')
    }
    const roleObj = roleRepository.create({ role, access, permission });
    const newRole = await roleRepository.save(roleObj)
    return {
        status: true,
        message: 'Role data created successfully!',
        data: newRole
    }
    // }
}

const updateRole = async (_: any, { id, role, access, permission }: { id: string, role: string, access: Access, permission: [string] }, context: any) => {
    // let { info } = context;
    // if (await authenticate(info, 'edit', 'Role')) {
    const roleData = await roleRepository.findOneBy({ id });
    roleData.role = role;
    roleData.access = access;
    roleData.permission = permission;
    let updateRole = await roleRepository.save(roleData)
    if (updateRole) {
        return {
            status: true,
            message: 'Role updated successfully!',
            data: updateRole
        }
    } else {
        throw graphqlErrorHandler(httpStatus.BAD_REQUEST, 'Role updated failed!');
    }
    // }
}

const deleteRole = async (_: any, { id }: { id: string }, context: any) => {
    // let { info } = context;
    // if (await authenticate(info, 'delete', 'Role')) {
    const deleteData = await roleRepository.delete(id);
    if (deleteData?.affected) {
        return {
            status: 200,
            message: 'Role deleted successfully'
        }
    } else {
        throw graphqlErrorHandler(httpStatus.BAD_REQUEST, 'Role deleted failed!');
    }
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