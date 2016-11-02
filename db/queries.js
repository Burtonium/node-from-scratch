var knex = require('./knex.js');

function Users() {
    return knex('users');
}

function getAllUsers() {
    return Users().select();
}

function getSingleUser(id) {
    return Users().where('id', parseInt(id)).first();
}

module.exports = {
    getAllUsers: getAllUsers,
    getSingleUser: getSingleUser
};
