export default `

scalar Date

type Role {
    _id: ID!,
    role: String!
    access: Access!
    permission:[String]
    createdAt:Date
    updatedAt:Date
}

type Access{
    add:Boolean
    view:Boolean
    edit:Boolean
    delete:Boolean
}

input AccessInput{
    add:Boolean
    view:Boolean
    edit:Boolean
    delete:Boolean
}

type CreateRoleResponse{
    status: Boolean!
    message: String!
    data: Role
}

type deleteInputResponse{
    status: Boolean!
    message: String!
}

type PaginateRoleResponse{
    total: Int
    page: Int
    pageSize: Int,
    data: [Role]
}

input updateRoleInput{
    id:ID!
    role: String
    access: AccessInput
    permission:[String]
}

type updateRoleResponse{
    status:Boolean!
    message:String!
    data:Role
}

type Query{
    getAllrole(index:Int!,limit:Int!):PaginateRoleResponse
}

type Mutation{
    createRole(role: String!,access: AccessInput,permission:[String]): CreateRoleResponse!
    updateRole(Input:updateRoleInput):updateRoleResponse!
    deleteRole(id:String!):deleteInputResponse!
}
`