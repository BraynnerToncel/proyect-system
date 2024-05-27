import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Reservation } from '../resevation/reservation.entity';
import { Loan } from '../loan/loan.entity';

@Entity('typeofuse')
export class TypeOfUse {
  @PrimaryGeneratedColumn('uuid')
  typeOfUseId: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  typeOfUseConcept: string;

  @OneToMany(() => Reservation, (reservation) => reservation.typeofuse)
  @JoinColumn()
  reservation: Array<Reservation>;

  @OneToMany(() => Loan, (loan) => loan.typeofuse)
  @JoinColumn()
  loan: Array<Loan>;
}
