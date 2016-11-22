var knex = require('../knex.js');

function Users() {
    return knex('users');
}

function getAllUsers() {
    return Users().select();
}

function findOrCreate(user) {
    return Users().where({email: user.email}).first();
}

function where(keyPairs) {
    return Users().where(keyPairs);
}

function insertUser(user) {
    return Users().insert(user, 'id');
}

function updateUser(id, updates) {
    return Users().where('id', parseInt(id)).update(updates, '*');
}

function deleteUser(id) {
    return Users().where('id', parseInt(id)).del();
}

module.exports = {
    findOrCreate: findOrCreate,
    get: getAllUsers,
    where: where,
    insert: insertUser,
    update: updateUser,
    delete: deleteUser
};
