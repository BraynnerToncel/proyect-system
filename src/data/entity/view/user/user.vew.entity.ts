import { User } from '@entity/api/user/user.entity';
import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  expression: (connection) =>
    connection
      .createQueryBuilder()
      .select('u.userId', 'userId')
      .addSelect('u.userFullName', 'userFullName')
      .addSelect('u.userLastName', 'userLastName')
      .addSelect('u.userState', 'userState')
      .addSelect('u.userEmail', 'userEmail')
      .addSelect('u.username', 'username')
      .addSelect('r.roleName', 'roleName')
      .addSelect('f.fileUrl', 'fileUrl')
      .from(User, 'u')
      .innerJoin('u.role', 'r')
      .innerJoin('u.file', 'f')
      .groupBy(
        'u.userId, u.userFullName, u.userLastName, u.userState, u.userEmail, u.username , r.roleName, f.fileUrl',
      ),
})
export class UserView {
  @ViewColumn()
  userId: string;

  @ViewColumn()
  userFullName: string;

  @ViewColumn()
  userLastName: string;

  @ViewColumn()
  userEmail: string;

  @ViewColumn()
  username: string;

  @ViewColumn()
  userState: boolean;

  @ViewColumn()
  roleName: string;

  @ViewColumn()
  fileUrl: string;
}
