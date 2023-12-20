export interface Irole extends Document {
    role: string,
    access: {
        add: boolean,
        view: boolean,
        edit: boolean,
        delete: boolean,
    },
    permission: [String]
}
export interface Access {
        add: boolean,
        view: boolean,
        edit: boolean,
        delete: boolean
}