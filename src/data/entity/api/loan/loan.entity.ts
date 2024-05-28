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

  @Column({ type: 'boolean', default: true, nullable: false })
  loanState: boolean;

  @ManyToOne(() => User, (user) => user.requestedUser)
  requestedUser: User;

  @ManyToOne(() => User, (user) => user.deliveryUser)
  deliveryUser: User;

  @ManyToOne(() => User, (user) => user.receivedUser)
  receivedUser: User;

  @ManyToOne(() => TypeOfUse, (typeOfUse) => typeOfUse.loan)
  typeOfUse: TypeOfUse;

  @ManyToOne(() => Element, (element) => element.loan)
  element: Element;
}
