/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .dropTableIfExists("members")
        .createTable("members", function (table) {
            table.increments("_id").primary();
            table.integer("userId").notNullable();
            table.string("name").defaultTo("").notNullable();
            table.string("email").defaultTo("").notNullable().unique();
            table.string("mobile").unique();
            table.boolean("paid").defaultTo(0).notNullable();
            table.integer("amount");
            table.timestamp("createdAt").defaultTo(knex.fn.now());
            table.timestamp("updatedAt").defaultTo(knex.fn.now());
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("members");
};
