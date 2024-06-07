import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Reservation } from '../resevation/reservation.entity';
import { Loan } from '../loan/loan.entity';
import { Type } from '../type/type.entity';
import { Install } from '../install/install.entity';
import { EElementState } from '@constant/elementState/elementState.constant';

@Entity()
export class Element {
  @PrimaryGeneratedColumn('uuid')
  elementId: string;
  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  elementName: string;

  @Column({
    type: 'enum',
    enum: EElementState,
    default: EElementState.available,
  })
  elementState: EElementState;

  @OneToMany(() => Reservation, (reservation) => reservation.element)
  @JoinColumn()
  reservation: Reservation;

  @OneToMany(() => Loan, (loan) => loan.element)
  @JoinColumn()
  loan: Loan;

  @ManyToOne(() => Type, (type) => type.element)
  type: Type;

  @OneToMany(() => Install, (install) => install.element, { eager: true })
  install: Install;
}
