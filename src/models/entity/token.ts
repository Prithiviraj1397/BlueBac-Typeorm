import {
    Entity,
    Column,
} from 'typeorm';
import BaseEntity from '../baseEntity';

export enum TokenTypes {
    ACCESS = 'access',
    REFRESH = 'refresh',
    RESET_PASSWORD = 'resetPassword',
    VERIFY_EMAIL = 'verifyEmail',
    INVITE_EMAIL = 'inviteEmail'
}

@Entity('Token')
export default class Token extends BaseEntity {

    @Column({ type: 'text', nullable: false })
    token: string;

    @Column({ type: 'timestamp', nullable: true })
    expires: Date;

    @Column({ type: 'enum', enum: TokenTypes, enumName: 'token_type' })
    type: TokenTypes;

    @Column({ type: 'varchar', length: 255 })
    userId: string;
}
