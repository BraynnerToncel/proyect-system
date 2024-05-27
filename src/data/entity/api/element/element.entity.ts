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

@Entity('element')
export class Element {
  @PrimaryGeneratedColumn('uuid')
  elementId: string;
  @Column({ type: 'varchar', length: 50, nullable: false })
  elementName: string;
  @Column({ type: 'boolean', nullable: false })
  elementState: boolean;

  @OneToMany(() => Reservation, (reservation) => reservation.element)
  @JoinColumn()
  reservation: Reservation;

  @OneToMany(() => Loan, (loan) => loan.element)
  @JoinColumn()
  loan: Loan;

  @ManyToOne(() => Type, (type) => type.element)
  type: Type;

  @OneToMany(() => Install, (install) => install.element)
  install: Install;
}
