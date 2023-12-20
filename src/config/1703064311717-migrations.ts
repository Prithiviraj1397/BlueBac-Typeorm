import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1703064311717 implements MigrationInterface {
    name = 'Migrations1703064311717'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`role\` (\`id\` varchar(36) NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`role\` varchar(255) NOT NULL, \`permission\` text NULL, \`accessAdd\` tinyint NOT NULL, \`accessView\` tinyint NOT NULL, \`accessEdit\` tinyint NOT NULL, \`accessDelete\` tinyint NOT NULL, UNIQUE INDEX \`IDX_367aad98203bd8afaed0d70409\` (\`role\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_367aad98203bd8afaed0d70409\` ON \`role\``);
        await queryRunner.query(`DROP TABLE \`role\``);
    }

}
