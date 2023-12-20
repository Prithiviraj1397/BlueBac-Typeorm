import "reflect-metadata";
import { DataSource } from "typeorm";
import path from "path";
import { Admin, Role } from "../models";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "root",
    database: "BlueBac",
    entities: [
        Admin,
        Role
    ],
    migrations: ["src/config/migrations/**/*.ts"],
    synchronize: false,
    migrationsRun: true,
    logging: false,
    // cli: {
    //     migrationsDir: "src/config/migrations"
    // },
})

// import {createConnection} from 'typeorm'
// import path from 'path'

// export async function connect() {
//   await createConnection({
//     type:"postgres",
//     host: "localhost",
//     port: 5432,
//     username: "postgres",
//     password: "123456",
//     database: "testgraphql",
//     entities: [
//       path.join(__dirname, '../entity/**/**.ts')
//     ],
//     synchronize: true
//   });
//   console.log('Database is Connected')
// }