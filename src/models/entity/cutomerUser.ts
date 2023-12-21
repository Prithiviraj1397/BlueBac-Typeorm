import { Entity, Column, OneToMany, BeforeInsert } from 'typeorm';
import BaseEntity from '../baseEntity';
import { IsEmail } from 'class-validator';
import CustomerAdministrator from './customerAdministrator'
import bcrypt from 'bcryptjs';
import httpStatus from 'http-status';
import graphqlErrorHandler from '../../utils/graphqlErrorHandler';

@Entity({ name: "Customer User" })
export default class customerUser extends BaseEntity {
    @Column({ type: 'varchar', length: 255, nullable: false })
    username: string

    @Column({ type: 'varchar', length: 80, nullable: false })
    @IsEmail()
    email: string

    @Column({ type: 'varchar', length: 255, nullable: true })
    password: string

    @Column({ type: 'boolean', default: false })
    status: boolean

    @OneToMany(() => CustomerAdministrator, (customerAdministrator) => customerAdministrator.users)
    Administrator: CustomerAdministrator

    @BeforeInsert()
    async hashPassword() {
        if (this.password) {
            this.password = await bcrypt.hash(this.password, 10);
        }
    }

    async comparePassword(enteredPassword: string): Promise<boolean> {
        return bcrypt.compare(enteredPassword, this.password);
    }
}