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
  
  Assertion.addProperty('ISO8601', function(){
    var self = this._obj;
    var regex = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;
    this.assert(regex.test(self), 
    'expected #{this} to be an IOS8601 datetime',
    'expected #{this} to be an IOS8601 datetime'
    );
  });
  
  Assertion.addChainableMethod('match');
};
