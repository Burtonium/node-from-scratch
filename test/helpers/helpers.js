module.exports = function(chai, utils) {
  var Assertion = chai.Assertion;

  utils.addProperty(Assertion.prototype, 'co', function() {
  });
};
