exports.up = function(knex, Promise) {
    return knex.schema.createTable('auth_clients', function(table) {
        table.increments('id').primary();
        table.string('secret').notNullable();
        table.string('name').notNullable().unique();
        table.string('user_id').notNullable();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('auth_clients');
};
