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

function findOne(keyPairs) {
    return Users().where(keyPairs).first();
}

function insertUser(user) {
    return Users().insert(user, 'id');
}

function updateUser(updates) {
    return Users().where({id: updates.id}).update(updates, '*');
}

function deleteUser(id) {
    return Users().where({id: id}).del();
}

module.exports = {
    findOrCreate: findOrCreate,
    findOne: findOne,
    get: getAllUsers,
    where: where,
    insert: insertUser,
    update: updateUser,
    delete: deleteUser
};
