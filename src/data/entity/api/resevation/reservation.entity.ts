import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { TypeOfUse } from '../typeOfUse/typeOfUse.entity';
import { Element } from '../element/element.entity';
import { EReservationState } from '@constant/reservationState/reservationState.constant';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  reservationId: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  reservationCreateAt: Date;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
  })
  reservationAt: Date;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
  })
  reservationTime: Date;

  @Column({
    type: 'enum',
    enum: EReservationState,
    default: EReservationState.Pending,
  })
  // Pending = 0
  // Delivered = 1
  // Canceled = 2
  // completed = 3
  // pending return = 4
  reservationState: EReservationState;

  @ManyToOne(() => User, (user) => user.reservation)
  user: User;

  @ManyToOne(() => TypeOfUse, (typeofuse) => typeofuse.reservation)
  typeofuse: TypeOfUse;

  @ManyToOne(() => Element, (element) => element.reservation)
  element: Element;
}
