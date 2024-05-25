import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1716650830265 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO public.permission  ("permissionId", "permissionName", "permissionDescription", "permissionState")VALUES
      ('4df9e7e6-1d0f-4583-95ae-4850bbb4eccd'::uuid, 'develop:permission:all', 'develop permission all (default)', true),
      ('cb7725f2-e86d-4b8a-b4c2-6fb48b8e1c30'::uuid, 'settings:permission:read', 'settings permission read (default)', true),
      ('8f551f61-dfa9-4dfa-92be-d8688b22e3c8'::uuid, 'settings:roles:read', 'settings roles read (default)', true),
      ('7395c38a-1459-4508-b573-83cba326fdc7'::uuid, 'settings:roles:create', 'settings roles create (default)', true),
      ('faf500dc-864b-4f7d-a943-ec6e91bc42a1'::uuid, 'settings:roles:update', 'settings roles update (default)', true),
      ('e8f99e5c-0bcc-4851-88ab-abb72f599fdd'::uuid, 'settings:roles:delete', 'settings roles delete (default)', true),
      ('6f162748-cb24-4e2e-b5b2-488ead5eb5a4'::uuid, 'settings:users:read', 'settings users read (default)', true),
      ('1e768017-b14e-4137-b0c5-b0de1a53cd9b'::uuid, 'settings:users:create', 'settings users create (default)', true),
      ('60099acd-7040-41e3-91ba-888e4b389b10'::uuid, 'settings:users:update', 'settings users update (default)', true),
      ('5a889721-cd5a-4ae8-9f33-4d5c7ea60885'::uuid, 'settings:users:delete', 'settings users delete (default)', true),
      ('dcb2b294-a942-4199-8586-88053be83d24'::uuid, 'settings:files:read', 'settings files read (default)', true),
      ('2f3a9472-d790-4d38-99b9-5ddca93a586c'::uuid, 'settings:files:create', 'settings files create (default)', true),
      ('723abff2-603a-48a5-8446-f7d39006cd71'::uuid, 'settings:files:update', 'settings files update (default)', true),
      ('543779e6-4860-4a29-86a7-999a9359973a'::uuid, 'settings:files:delete', 'settings files delete (default)', true);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
  TRUNCATE TABLE public.permissions RESTART IDENTITY CASCADE;
`);
  }
}
