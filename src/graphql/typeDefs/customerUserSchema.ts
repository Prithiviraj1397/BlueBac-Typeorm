export default `

scalar Date

type CustomerUser{
    id:ID!
    username:String
    email:String
    password:String
    status:Boolean
    administrator:CustomerAdmin
    createdAt:Date
    updatedAt:Date
}

`