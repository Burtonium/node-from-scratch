exports.up = function(knex, Promise) {
    return knex.schema.createTable('users', function(table) {
        table.increments('id').primary();
        table.string('email').notNullable().unique().index();
        table.string('hashed_password').notNullable();
        table.string('address');
        table.timestamp('created').defaultTo(knex.fn.now());
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('users');
};
