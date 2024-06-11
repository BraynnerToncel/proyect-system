import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Element } from '../element/element.entity';
import { ELoanState } from '@constant/loan/loanState.constant';

@Entity()
export class Loan {
  @PrimaryGeneratedColumn('uuid')
  loanId: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  loanCreateAt: Date;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  loanReturnAt: Date;

  @Column({ type: 'enum', enum: ELoanState, default: ELoanState.asset })
  // asset = 0
  // completed = 1
  // undelivered = 2
  loanState: ELoanState;

  @ManyToOne(() => User, (user) => user.requestedUser)
  requestedUser: User;

  @ManyToOne(() => User, (user) => user.deliveryUser)
  deliveryUser: User;

  @ManyToOne(() => User, (user) => user.receivedUser)
  receivedUser: User;

  @ManyToOne(() => Element, (element) => element.loan)
  element: Element;
}
