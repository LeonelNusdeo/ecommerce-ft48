import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1714547675591 implements MigrationInterface {
    name = 'Initial1714547675591'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "email" character varying(50) NOT NULL, "password" character varying(20) NOT NULL, "phone" integer, "country" character varying(50), "address" text, "city" character varying(50), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" date NOT NULL, "user_id" uuid, CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "orderdetails" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "price" numeric(10,2) NOT NULL, "order_id" uuid, CONSTRAINT "REL_c1b469bc2ffb4a3117c9f8ebdd" UNIQUE ("order_id"), CONSTRAINT "PK_cf4437dc89cc45584aba8c340cd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "description" text NOT NULL, "price" numeric(10,2) NOT NULL, "stock" integer NOT NULL, "imgUrl" text NOT NULL DEFAULT 'https://cdn-icons-png.freepik.com/512/679/679922.png', "category_id" uuid, CONSTRAINT "UQ_4c9fb58de893725258746385e16" UNIQUE ("name"), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "orderdetails_products" ("product_id" uuid NOT NULL, "orderdetail_id" uuid NOT NULL, CONSTRAINT "PK_b65a1c21b4a0ca1ef946a8ed495" PRIMARY KEY ("product_id", "orderdetail_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_11ec3ce7e3afd0ebd129d4d440" ON "orderdetails_products" ("product_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_b242cf9c19ecd9d43a470cb715" ON "orderdetails_products" ("orderdetail_id") `);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_a922b820eeef29ac1c6800e826a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orderdetails" ADD CONSTRAINT "FK_c1b469bc2ffb4a3117c9f8ebdda" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_9a5f6868c96e0069e699f33e124" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orderdetails_products" ADD CONSTRAINT "FK_11ec3ce7e3afd0ebd129d4d4406" FOREIGN KEY ("product_id") REFERENCES "orderdetails"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "orderdetails_products" ADD CONSTRAINT "FK_b242cf9c19ecd9d43a470cb7152" FOREIGN KEY ("orderdetail_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orderdetails_products" DROP CONSTRAINT "FK_b242cf9c19ecd9d43a470cb7152"`);
        await queryRunner.query(`ALTER TABLE "orderdetails_products" DROP CONSTRAINT "FK_11ec3ce7e3afd0ebd129d4d4406"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_9a5f6868c96e0069e699f33e124"`);
        await queryRunner.query(`ALTER TABLE "orderdetails" DROP CONSTRAINT "FK_c1b469bc2ffb4a3117c9f8ebdda"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_a922b820eeef29ac1c6800e826a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b242cf9c19ecd9d43a470cb715"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_11ec3ce7e3afd0ebd129d4d440"`);
        await queryRunner.query(`DROP TABLE "orderdetails_products"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TABLE "orderdetails"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "categories"`);
    }

}
