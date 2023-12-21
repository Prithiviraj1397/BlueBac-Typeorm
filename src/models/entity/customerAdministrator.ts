import {
  Entity,
  ManyToOne,
  Column,
  BeforeInsert,
} from 'typeorm';
import bcrypt from 'bcryptjs';
import { IsEmail, } from 'class-validator';
import BaseEntity from '../baseEntity';
import CustomerUser from './cutomerUser';

@Entity({ name: 'Customer Administrator' })
export default class CustomerAdministrator extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  username: string;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  @IsEmail()
  email: string;

  @Column({ type: 'varchar', nullable: true })
  password: string;

  @Column({ type: 'boolean', default: false })
  status: boolean;

  @ManyToOne(() => CustomerUser, (customerUser) => customerUser.Administrator)
  users: CustomerUser

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
