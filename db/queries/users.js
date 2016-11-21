var knex = require('../knex.js');

function Users() {
    return knex('users');
}

function getAllUsers() {
    return Users().select();
}

function where(keyPairs) {
    return Users().where(keyPairs);
}

function insertUser(user) {
    return Users().insert(user, 'id');
}

function updateUser(id, updates) {
    return Users().where('id', parseInt(id)).update(updates);
}

function deleteUser(id) {
    return Users().where('id', parseInt(id)).del();
}

module.exports = {
    get: getAllUsers,
    where: where,
    insert: insertUser,
    update: updateUser,
    delete: deleteUser
};
