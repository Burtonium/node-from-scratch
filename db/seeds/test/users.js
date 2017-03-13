const t = 'users';
var users = [];

for (var i = 0; i < 100; ++i) {
    users.push({
        email: 'user' + i + '@burtonize.me',
        hashed_password: 'password',
        address: i + ' Ferguson Street'
    });
}

module.exports = {
    seed(knex) {

        // Delete existing entries 
        return knex(t).del()

        // then insert seeded data
        .then(() => { return knex(t).insert(users); })
        .then(() => { return Promise.all(users); });
    }
};
