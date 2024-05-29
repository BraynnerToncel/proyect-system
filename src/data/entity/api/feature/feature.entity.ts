import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Type } from '../type/type.entity';
import { Install } from '../install/install.entity';

@Entity()
export class Feature {
  @PrimaryGeneratedColumn('uuid')
  featureId: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  featureName: string;

  @Column({ type: 'boolean', default: true, nullable: false })
  featureState: boolean;

  @Column({ type: 'boolean', nullable: false })
  featureRequired: boolean;

  @Column({ type: 'varchar', length: 50, nullable: false })
  featureUseName: string;

  @ManyToMany(() => Type, (type) => type.feature)
  type: Array<Type>;

  @OneToMany(() => Install, (install) => install.feature)
  install: Install;
}
