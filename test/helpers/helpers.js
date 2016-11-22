module.exports = function(chai) {
  var Assertion = chai.Assertion;

  Assertion.addMethod('intersect', function(rhs) {
    var lhs = this._obj;

    this.assert(
      (function(lhs, rhs) {
        var result = false;
        for (var k in lhs) {
          result = rhs.hasOwnProperty(k) && lhs[k] == rhs[k];
          if (!result) {
            return false;
          }
        }
        return true;
      })(lhs, rhs), 'expected #{this} to intersect #{exp}', '', rhs
    );
  });
};
