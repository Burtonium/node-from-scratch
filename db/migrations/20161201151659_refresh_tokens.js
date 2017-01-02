const tableName = 'refresh_tokens';

exports.up = function(knex, Promise) {
    return knex.schema.createTable(tableName, function(table) {
        table.integer('user_id').notNullable().index()
            .references('id').inTable('users');
        table.integer('client_id').notNullable().index()
            .references('id').inTable('auth_clients');
        table.string('token').notNullable().unique();
        table.timestamp('created').defaultTo(knex.fn.now());
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable(tableName);
};
