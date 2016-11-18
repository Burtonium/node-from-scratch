var knex = require('../knex.js');

function Users() {
    return knex('users');
}

function getAllUsers() {
    return Users().select();
}

function getUser(id) {
    return Users().where('id', parseInt(id)).first();
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
    getAllUsers: getAllUsers,
    getUser: getUser,
    insertUser: insertUser,
    updateUser: updateUser,
    deleteUser: deleteUser
};
