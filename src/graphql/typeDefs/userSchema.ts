export default `
scalar Date

type LoginResponse{
 status:Boolean
 message: String
 token:String
 role:Role
}

type forgetPasswordResponse{
    status:Boolean!
    message: String!
}

type Query{
    tokenValidate(token:String!):forgetPasswordResponse   
}

type Mutation{
    inviteResetPassward(token:String!,password:String!):forgetPasswordResponse
}


`