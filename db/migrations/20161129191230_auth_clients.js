var tableName = 'auth_clients';

exports.up = function(knex, Promise) {
    return knex.schema.createTable(tableName, function(table) {
        table.increments('id').primary();
        table.string('secret').notNullable();
        table.string('name').notNullable();
        table.string('client_id').notNullable().unique().index();
        table.timestamp('created').defaultTo(knex.fn.now());
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable(tableName);
};
