// import { MigrationInterface, QueryRunner } from 'typeorm';

// export class Migrations1718746916276 implements MigrationInterface {
//   public async up(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.query(`
//             INSERT INTO public."role" ("roleId","roleName","roleDescription","roleState") VALUES
//             ('4bb8811c-e550-4032-8e1d-4d0296ab60b6','admin','admin',true);
//           `);

//     await queryRunner.query(`
//           INSERT INTO roles_has_permissions ("roleRoleId", "permissionPermissionId")
//           VALUES('4bb8811c-e550-4032-8e1d-4d0296ab60b6', '4df9e7e6-1d0f-4583-95ae-4850bbb4eccd');
//         `);
//     await queryRunner.query(`
//         INSERT INTO public.user ("userId","userFullName","userLastName","username","userEmail","userPassword","userState","roleRoleId" , "fileFileId")
//         VALUES ('9db7a487-c944-47a2-a5f6-77a4287edcdf','admin','admin','admin','admin@admin.com','$2a$10$BbW6jeQa5DRe5u.uN8KMIeY2C82quaNRgD6on6YETvU0oz0mctNBO',true,'4bb8811c-e550-4032-8e1d-4d0296ab60b6', null);
//         `);
//   }

//   public async down(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.query(`
//             TRUNCATE TABLE roles_has_permissions RESTART IDENTITY CASCADE;
//           `);
//     await queryRunner.query(`
//             TRUNCATE TABLE public."role" RESTART IDENTITY CASCADE;
//           `);
//     await queryRunner.query(`
//             TRUNCATE TABLE public.users RESTART IDENTITY CASCADE;
//           `);
//   }
// }
