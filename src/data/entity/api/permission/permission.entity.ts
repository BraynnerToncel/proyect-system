import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../role/role.entity';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  permissionId: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  permissionName: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  permissionDescription: string;

  @Column({ type: 'boolean', default: true })
  permissionState: boolean;

  @ManyToMany(() => Role, (role) => role.permissions)
  role: Array<Role>;
}
