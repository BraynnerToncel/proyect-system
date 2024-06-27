import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1716650341772 implements MigrationInterface {
  name = 'Migrations1716650341772';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "permission" ("permissionId" uuid NOT NULL DEFAULT uuid_generate_v4(), "permissionName" character varying(100) NOT NULL, "permissionDescription" character varying(200) NOT NULL, "permissionState" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_86b314be9c1be5c62b3a9d97ae4" PRIMARY KEY ("permissionId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "role" ("roleId" uuid NOT NULL DEFAULT uuid_generate_v4(), "roleName" character varying(45) NOT NULL, "roleDescription" character varying(100) NOT NULL, "roleState" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_703705ba862c2bb45250962c9e1" PRIMARY KEY ("roleId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "type_of_use" ("typeOfUseId" uuid NOT NULL DEFAULT uuid_generate_v4(), "typeOfUseName" character varying(20) NOT NULL, "typeOfUseConcept" character varying(50) NOT NULL, CONSTRAINT "PK_562028de392fde88fbec098e506" PRIMARY KEY ("typeOfUseId"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."reservation_reservationstate_enum" AS ENUM('0', '1', '2', '3', '4')`,
    );
    await queryRunner.query(
      `CREATE TABLE "reservation" ("reservationId" uuid NOT NULL DEFAULT uuid_generate_v4(), "reservationCreateAt" TIMESTAMP NOT NULL DEFAULT now(), "reservationAt" TIMESTAMP NOT NULL DEFAULT now(), "reservationTime" TIMESTAMP NOT NULL DEFAULT now(), "reservationState" "public"."reservation_reservationstate_enum" NOT NULL DEFAULT '0', "userUserId" uuid, "typeofuseTypeOfUseId" uuid, "elementElementId" uuid, CONSTRAINT "PK_afb522c4e412047329fd5806dc2" PRIMARY KEY ("reservationId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "install" ("installId" uuid NOT NULL DEFAULT uuid_generate_v4(), "value" character varying(50) NOT NULL, "featureFeatureId" uuid, "elementElementId" uuid, CONSTRAINT "PK_637305acfbf69416fa02533e1bc" PRIMARY KEY ("installId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "feature" ("featureId" uuid NOT NULL DEFAULT uuid_generate_v4(), "featureName" character varying(50) NOT NULL, "featureState" boolean NOT NULL DEFAULT true, "featureRequired" boolean NOT NULL, "featureUseName" character varying(50) NOT NULL, CONSTRAINT "PK_a9741bb40b605518c6f1541a557" PRIMARY KEY ("featureId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "type" ("typeId" uuid NOT NULL DEFAULT uuid_generate_v4(), "typeName" character varying(50) NOT NULL, "typeDescription" character varying(50), "typeState" character varying NOT NULL DEFAULT true, CONSTRAINT "PK_3a25b3b7490c51932eb4d7b6491" PRIMARY KEY ("typeId"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."element_elementstate_enum" AS ENUM('0', '1', '2', '3')`,
    );
    await queryRunner.query(
      `CREATE TABLE "element" ("elementId" uuid NOT NULL DEFAULT uuid_generate_v4(), "elementName" character varying(50) NOT NULL, "elementState" "public"."element_elementstate_enum" NOT NULL DEFAULT '0', "typeTypeId" uuid, CONSTRAINT "UQ_c4a59a4b5b0821c1506931d5a3f" UNIQUE ("elementName"), CONSTRAINT "PK_41aa81f006b870bc490b86ecb7f" PRIMARY KEY ("elementId"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."loan_loanstate_enum" AS ENUM('0', '1', '2')`,
    );
    await queryRunner.query(
      `CREATE TABLE "loan" ("loanId" uuid NOT NULL DEFAULT uuid_generate_v4(), "loanCreateAt" TIMESTAMP NOT NULL DEFAULT now(), "loanReturnAt" TIMESTAMP NOT NULL DEFAULT now(), "loanState" "public"."loan_loanstate_enum" NOT NULL DEFAULT '0', "requestedUserUserId" uuid, "deliveryUserUserId" uuid, "receivedUserUserId" uuid, "elementElementId" uuid, CONSTRAINT "PK_5ae96496534c6e154001892aced" PRIMARY KEY ("loanId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "file" ("fileId" uuid NOT NULL DEFAULT uuid_generate_v4(), "fileName" character varying(50) NOT NULL, "fileType" character varying NOT NULL DEFAULT true, "fileUrl" character varying NOT NULL, "fileLength" character varying(50) NOT NULL, CONSTRAINT "PK_f620cbf511fcf9b5970d187fdca" PRIMARY KEY ("fileId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("userId" uuid NOT NULL DEFAULT uuid_generate_v4(), "userFullName" character varying(32) NOT NULL, "userLastName" character varying(32) NOT NULL, "username" character varying(24) NOT NULL, "userEmail" character varying(32) NOT NULL, "userPassword" character varying(60) NOT NULL, "userState" boolean NOT NULL DEFAULT true, "roleRoleId" uuid, "fileFileId" uuid, CONSTRAINT "UQ_12154a081bd1a5183a62e7ee076" UNIQUE ("userFullName", "username", "userLastName"), CONSTRAINT "REL_e9ac21f63535580f0c50b22817" UNIQUE ("fileFileId"), CONSTRAINT "PK_d72ea127f30e21753c9e229891e" PRIMARY KEY ("userId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "roles_has_permissions" ("roleRoleId" uuid NOT NULL, "permissionPermissionId" uuid NOT NULL, CONSTRAINT "PK_af15ccac31be8675c639966fd4c" PRIMARY KEY ("roleRoleId", "permissionPermissionId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3beb30d0cc8790859f16ad9ff9" ON "roles_has_permissions" ("roleRoleId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7a49bb3774e053242dee39cc5e" ON "roles_has_permissions" ("permissionPermissionId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "types_has_features" ("typeTypeId" uuid NOT NULL, "featureFeatureId" uuid NOT NULL, CONSTRAINT "PK_0b1646eb91cbe31182f8d1f188d" PRIMARY KEY ("typeTypeId", "featureFeatureId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_702b41429fe470bad76b8b251f" ON "types_has_features" ("typeTypeId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_46d55f39e289a04dc5969a61e6" ON "types_has_features" ("featureFeatureId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "reservation" ADD CONSTRAINT "FK_621ae76640bd1a38c2cc1f5f622" FOREIGN KEY ("userUserId") REFERENCES "user"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reservation" ADD CONSTRAINT "FK_5eb56623bfd4a9b19db71aacc0b" FOREIGN KEY ("typeofuseTypeOfUseId") REFERENCES "type_of_use"("typeOfUseId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reservation" ADD CONSTRAINT "FK_fde88f2b312910500726182924e" FOREIGN KEY ("elementElementId") REFERENCES "element"("elementId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "install" ADD CONSTRAINT "FK_e2a50f7f1ab73119c6581d49c2a" FOREIGN KEY ("featureFeatureId") REFERENCES "feature"("featureId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "install" ADD CONSTRAINT "FK_41643a250466e8162858a4cae74" FOREIGN KEY ("elementElementId") REFERENCES "element"("elementId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "element" ADD CONSTRAINT "FK_b40e815fb9d2527236070814087" FOREIGN KEY ("typeTypeId") REFERENCES "type"("typeId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "loan" ADD CONSTRAINT "FK_539f364619edcb843e5b931e569" FOREIGN KEY ("requestedUserUserId") REFERENCES "user"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "loan" ADD CONSTRAINT "FK_ac1fed2157159f674b98e0d2373" FOREIGN KEY ("deliveryUserUserId") REFERENCES "user"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "loan" ADD CONSTRAINT "FK_82429a1ba34025f89187310e620" FOREIGN KEY ("receivedUserUserId") REFERENCES "user"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "loan" ADD CONSTRAINT "FK_6e0679705e96703dfea91038af8" FOREIGN KEY ("elementElementId") REFERENCES "element"("elementId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_ffe3092db843bd8f90fcfe97da7" FOREIGN KEY ("roleRoleId") REFERENCES "role"("roleId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_e9ac21f63535580f0c50b228179" FOREIGN KEY ("fileFileId") REFERENCES "file"("fileId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles_has_permissions" ADD CONSTRAINT "FK_3beb30d0cc8790859f16ad9ff96" FOREIGN KEY ("roleRoleId") REFERENCES "role"("roleId") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles_has_permissions" ADD CONSTRAINT "FK_7a49bb3774e053242dee39cc5e1" FOREIGN KEY ("permissionPermissionId") REFERENCES "permission"("permissionId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "types_has_features" ADD CONSTRAINT "FK_702b41429fe470bad76b8b251fe" FOREIGN KEY ("typeTypeId") REFERENCES "type"("typeId") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "types_has_features" ADD CONSTRAINT "FK_46d55f39e289a04dc5969a61e62" FOREIGN KEY ("featureFeatureId") REFERENCES "feature"("featureId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`,
      [
        'public',
        'VIEW',
        'user_view',
        'SELECT "u"."userId" AS "userId", "u"."userFullName" AS "userFullName", "u"."userLastName" AS "userLastName", "u"."username" AS "username", "u"."userEmail" AS "userEmail", "u"."userState" AS "userState", "r"."roleName" AS "roleName", "f"."fileUrl" AS "fileUrl" FROM "user" "u" INNER JOIN "role" "r" ON "r"."roleId"="u"."roleRoleId"  INNER JOIN "file" "f" ON "f"."fileId"="u"."fileFileId" GROUP BY "u"."userId", "u"."userFullName", "u"."userLastName", "u"."userState", "u"."userEmail", "u"."username" , "r"."roleName", "f"."fileUrl"',
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`,
      ['VIEW', 'user_view', 'public'],
    );
    await queryRunner.query(`DROP VIEW "user_view"`);
    await queryRunner.query(
      `ALTER TABLE "types_has_features" DROP CONSTRAINT "FK_46d55f39e289a04dc5969a61e62"`,
    );
    await queryRunner.query(
      `ALTER TABLE "types_has_features" DROP CONSTRAINT "FK_702b41429fe470bad76b8b251fe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles_has_permissions" DROP CONSTRAINT "FK_7a49bb3774e053242dee39cc5e1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles_has_permissions" DROP CONSTRAINT "FK_3beb30d0cc8790859f16ad9ff96"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_e9ac21f63535580f0c50b228179"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_ffe3092db843bd8f90fcfe97da7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "loan" DROP CONSTRAINT "FK_6e0679705e96703dfea91038af8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "loan" DROP CONSTRAINT "FK_82429a1ba34025f89187310e620"`,
    );
    await queryRunner.query(
      `ALTER TABLE "loan" DROP CONSTRAINT "FK_ac1fed2157159f674b98e0d2373"`,
    );
    await queryRunner.query(
      `ALTER TABLE "loan" DROP CONSTRAINT "FK_539f364619edcb843e5b931e569"`,
    );
    await queryRunner.query(
      `ALTER TABLE "element" DROP CONSTRAINT "FK_b40e815fb9d2527236070814087"`,
    );
    await queryRunner.query(
      `ALTER TABLE "install" DROP CONSTRAINT "FK_41643a250466e8162858a4cae74"`,
    );
    await queryRunner.query(
      `ALTER TABLE "install" DROP CONSTRAINT "FK_e2a50f7f1ab73119c6581d49c2a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reservation" DROP CONSTRAINT "FK_fde88f2b312910500726182924e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reservation" DROP CONSTRAINT "FK_5eb56623bfd4a9b19db71aacc0b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reservation" DROP CONSTRAINT "FK_621ae76640bd1a38c2cc1f5f622"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_46d55f39e289a04dc5969a61e6"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_702b41429fe470bad76b8b251f"`,
    );
    await queryRunner.query(`DROP TABLE "types_has_features"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7a49bb3774e053242dee39cc5e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3beb30d0cc8790859f16ad9ff9"`,
    );
    await queryRunner.query(`DROP TABLE "roles_has_permissions"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "file"`);
    await queryRunner.query(`DROP TABLE "loan"`);
    await queryRunner.query(`DROP TYPE "public"."loan_loanstate_enum"`);
    await queryRunner.query(`DROP TABLE "element"`);
    await queryRunner.query(`DROP TYPE "public"."element_elementstate_enum"`);
    await queryRunner.query(`DROP TABLE "type"`);
    await queryRunner.query(`DROP TABLE "feature"`);
    await queryRunner.query(`DROP TABLE "install"`);
    await queryRunner.query(`DROP TABLE "reservation"`);
    await queryRunner.query(
      `DROP TYPE "public"."reservation_reservationstate_enum"`,
    );
    await queryRunner.query(`DROP TABLE "type_of_use"`);
    await queryRunner.query(`DROP TABLE "role"`);
    await queryRunner.query(`DROP TABLE "permission"`);
  }
}
