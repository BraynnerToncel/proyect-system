import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../role/role.entity';
import { Loan } from '../loan/loan.entity';
import { Reservation } from '../resevation/reservation.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column({ type: 'varchar', length: 32, nullable: false })
  userFullName: string;

  @Column({ type: 'varchar', length: 32, nullable: false })
  userLastName: string;

  @Column({ type: 'varchar', length: 24, nullable: false })
  username: string;

  @Column({ type: 'varchar', length: 32, nullable: false })
  userEmail: string;

  @Column({ type: 'varchar', length: 60, nullable: false })
  userPassword: string;

  @Column({ type: 'boolean', default: true, nullable: false })
  userState: boolean;

  @ManyToOne(() => Role, (role) => role.user)
  role: Role;

  @OneToMany(() => Loan, (loan) => loan.deliveryUser)
  deliveryUser: Array<Loan>;

  @OneToMany(() => Loan, (loan) => loan.receivedUser)
  receivedUser: Array<Loan>;

  @OneToMany(() => Loan, (loan) => loan.requestedUser)
  requestedUser: Array<Loan>;

  @OneToMany(() => Reservation, (reservation) => reservation.user)
  reservation: Array<Reservation>;
}
