var t = 'users';
var users = [];

for (var i = 0; i < 100; ++i) {
    users.push({
        email: 'user' + i + '@burtonize.me',
        password: 'password',
        address: i + ' Ferguson Street'
    });
}

module.exports = {
    seed: function(knex, Promise) {

        // Delete existing entries
        return knex(t).del()

        // then insert seeded data
        .then(function() {
                return knex(t).insert(users);
            })
            .then(function() {
                return Promise.all(users);
            });

    }
};
