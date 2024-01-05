/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .dropTableIfExists("group_members")
        .createTable("group_members", function (table) {
            table.increments("_id").primary();
            table.integer("groupId").unsigned().notNullable();
            table.integer("memberId").unsigned().notNullable();
            table.timestamp("createdAt").defaultTo(knex.fn.now());
            table.timestamp("updatedAt").defaultTo(knex.fn.now());

            table.unique(["groupId", "memberId"]);
            table
                .foreign("groupId")
                .references("groups._id")
                .onDelete("CASCADE");
            table
                .foreign("memberId")
                .references("members._id")
                .onDelete("CASCADE");
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("group_members");
};
