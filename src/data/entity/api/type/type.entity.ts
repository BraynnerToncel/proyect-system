import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Element } from '../element/element.entity';
import { Feature } from '../feature/feature.entity';

@Entity()
export class Type {
  @PrimaryGeneratedColumn('uuid')
  typeId: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  typeName: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  typeDescription: string;

  @Column({ type: 'varchar', default: true, nullable: false })
  typeState: boolean;

  @OneToMany(() => Element, (element) => element.type)
  @JoinColumn()
  element: Element;

  @ManyToMany(() => Feature, (feature) => feature.type, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinTable({ name: 'types_has_features' })
  feature: Array<Feature>;
}
