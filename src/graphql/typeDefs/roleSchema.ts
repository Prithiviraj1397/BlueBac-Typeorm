export default `

scalar Date

type Role {
    id: ID!,
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
    updateRole( id:ID!,role: String,access: AccessInput,permission:[String]):updateRoleResponse!
    deleteRole(id:String!):deleteInputResponse!
}
`