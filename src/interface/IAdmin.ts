export interface Iadmin extends Document {
    username: String,
    email: String,
    password: String,
    type: String,
    role: String
}

export interface loginInput {
    username: String,
    password: String
}

export interface createSubadminInput {
    username: string,
    email: string,
    type: string,
    role: string
}

export interface createCustomerUserInput {
    username: string,
    email: string,
    administrator: any
}

export interface createCustomerAdminInput {
    username: string,
    email: string,
}
