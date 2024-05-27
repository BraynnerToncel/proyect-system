import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Feature } from '../feature/feature.entity';
import { Element } from '../element/element.entity';

@Entity('install')
export class Install {
  @PrimaryGeneratedColumn('uuid')
  installId: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  value: string;

  @ManyToOne(() => Feature, (feature) => feature.install)
  @JoinColumn()
  feature: Feature;

  @ManyToOne(() => Element, (element) => element.install)
  @JoinColumn()
  element: Element;
}
