export default `

scalar Date

type Admin {
    id: ID
    username: String
    email:String
    password: String
    type: String
    role : Role
    createdAt:Date
    updatedAt:Date
}

type PaginateAdminResponse{
    total: Int
    page: Int
    pageSize: Int,
    data: [Admin]
}

enum TYPE{
    admin
    subadmin
}

type createSubadminResponse{
    status:Boolean!
    message:String!
    data:Admin!
}

input CustomerAdminInput{
    username:String!
    email:String!
}

type createCustomerAdminResponse{
    status:Boolean!
    message:String!
    data:CustomerAdmin!
}

input CustomerUserInput{
    username:String!
    email:String!
    administrator:String!
}

type createCustomerUserResponse{
    status:Boolean!
    message:String!
    data:CustomerUser!
}

type Query{
    getAllAdmin(index:Int!,limit:Int!):PaginateAdminResponse
}

type Mutation{
    createSubadmin(username: String!,email:String!,type: TYPE,role : String!):createSubadminResponse
    createCustomerAdmin(Input:CustomerAdminInput):createCustomerAdminResponse
    createCustomerUser(Input:CustomerUserInput):createCustomerUserResponse
    deleteAdmin(id:String!):deleteInputResponse!
}
`
