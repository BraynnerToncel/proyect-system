import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Permission } from '../permission/permission.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  roleId: string;

  @Column({ type: 'varchar', length: 45, nullable: false })
  roleName: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  roleDescription: string;

  @Column({ type: 'bool', default: true })
  roleState: boolean;

  @OneToMany(() => User, (user) => user.role)
  @JoinColumn()
  user: Array<User>;

  @ManyToMany(() => Permission, (permission) => permission.role, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinTable({ name: 'roles_has_permissions' })
  permissions: Array<Permission>;
}
