import {
    Entity,
    Column,
    Unique,
    ManyToOne,
    BeforeInsert,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import BaseEntity from '../baseEntity';
import Role from './role';

@Entity('Admin')
@Unique(['email'])
export default class Admin extends BaseEntity {

    @Column({ type: 'varchar', length: 255 })
    username: string;

    @Column({ type: 'varchar', length: 255 })
    email: string;

    @Column({ type: 'varchar', length: 255, select: false, nullable: true })
    password: string;

    @Column({ type: 'varchar', length: 50 })
    type: string;

    @Column({ type: 'boolean', default: false })
    status: boolean;

    @ManyToOne(() => Role, (role) => role.admins)
    role: Role

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }

    async comparePassword(enteredPassword: string): Promise<boolean> {
        return await bcrypt.compare(enteredPassword, this.password);
    }
}
