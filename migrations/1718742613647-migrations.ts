// import { MigrationInterface, QueryRunner } from 'typeorm';

// export class Migrations1718742613647 implements MigrationInterface {
//   public async up(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.query(`
//         CREATE VIEW "user_view" AS
//         SELECT
//           u."userId" AS "userId",
//           u."userLastName" AS "userLastName",
//           u."userFullName" AS "userFullName",
//           u."userEmail" AS "userEmail",
//           u."username" AS "username",
//           u."userState" AS "userState",
//           r."roleName" AS "roleName",
//           f."fileUrl" AS "fileUrl"
//         FROM public."user" u
//         INNER JOIN public."role" r ON u."roleRoleId" = r."roleId"
//         LEFT JOIN public."file" f ON u."fileFileId" = f."fileId"
//         `);
//   }

//   public async down(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.query(`
//         DROP VIEW "user_view";
//         `);
//   }
// }
