import { Entity, Column, 
    // OneToMany
 } from 'typeorm';
import BaseEntity from '../baseEntity';
// import Admin from './adminModel';
class Access {
    @Column({ type: 'boolean' })
    add: boolean;

    @Column({ type: 'boolean' })
    view: boolean;

    @Column({ type: 'boolean' })
    edit: boolean;

    @Column({ type: 'boolean' })
    delete: boolean;
}

@Entity()
export default class Role extends BaseEntity {
    @Column({ unique: true })
    role: string

    @Column('simple-array', { nullable: true })
    permission: string[]

    @Column(() => Access)
    access: Access;

    // @OneToMany(() => Admin, (admin) => admin.role)
    // admins: Admin[]
}
