/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .dropTableIfExists("groups")
        .createTable("groups", function (table) {
            table.increments("_id").primary();
            table.integer("userId").notNullable();
            table.string("name").notNullable();
            table.string("subject").notNullable();
            table.string("image");
            table.decimal("totalAmount", 10, 2).defaultTo(0);
            table.boolean("paid").defaultTo(0).notNullable();
            table.boolean("reminder").defaultTo(1).notNullable();
            table.timestamp("createdAt").defaultTo(knex.fn.now());
            table.timestamp("updatedAt").defaultTo(knex.fn.now());
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("groups");
};
