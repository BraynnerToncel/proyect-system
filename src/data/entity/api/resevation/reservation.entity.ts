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
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  reservationAt: Date;

  @Column({ type: 'boolean', default: true, nullable: false })
  reservationState: boolean;

  @ManyToOne(() => User, (user) => user.reservation)
  user: User;

  @ManyToOne(() => TypeOfUse, (typeofuse) => typeofuse.reservation)
  typeofuse: TypeOfUse;

  @ManyToOne(() => Element, (element) => element.reservation)
  element: Element;
}
