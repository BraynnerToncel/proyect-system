import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class File {
  @PrimaryGeneratedColumn('uuid')
  fileId: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  fileName: string;

  @Column({ type: 'varchar', default: true, nullable: false })
  fileType: string;

  @Column({ type: 'varchar', nullable: false })
  fileUrl: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  fileLength: number;

  @OneToOne(() => User, (user) => user.file)
  user: User;
}
