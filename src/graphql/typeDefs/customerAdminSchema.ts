export default `

scalar Date

type CustomerAdmin{
    id:ID!
    username:String
    email:String
    password:String
    status:Boolean
    createdAt:Date
    updatedAt:Date
}

`