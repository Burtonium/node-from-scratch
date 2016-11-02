exports.seed = function(knex, Promise) {
  var t = 'users';
  var users = [];
  
  for (var i = 0; i < 100; ++i) {
    users.push(
      knex(t).insert({
        username: 'user' + i,
        email: 'user' + i + '@burtonize.me',
        password: 'password'
      })
    );
  }

  // Delete existing entries
  return knex(t).del()
  
    // then insert seeded data
    .then(function() {
      return Promise.all(users);
    });
};
