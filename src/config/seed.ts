import mongoose from "mongoose";
import { connect, close } from './db'
import { Admin, Role } from "../models";
connect();

async function seedAdmin(email: string, password: string) {
    try {
        //create Role
        const role = await Role.create({
            "role": "Admin",
            "access": {
                "add": true,
                "view": true,
                "edit": true,
                "delete": true
            },
            "permission": [
                "ALL"
            ]
        })

        // Seed admin data
        const admin = new Admin({
            username: 'Admin',
            email,
            password,
            type: 'admin',
            status: true,
            role: role._id
        });

        await admin.save();

        console.log('Admin user created successfully');
    } catch (error) {
        console.error('Error seeding admin user:', error);
    } finally {
        close();
    }
}

const [, , adminEmail, adminPassword] = process.argv;

if (!adminEmail || !adminPassword) {
    console.error('Usage: node seed.js <adminEmail> <adminPassword>');
    process.exit(1);
}

seedAdmin(adminEmail, adminPassword);
