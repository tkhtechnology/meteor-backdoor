/* globals meteorInstall: false */

var vm = Npm.require('vm');

Meteor.methods({
  'xolvio/backdoor': async function (func, args) {
    check(func, String);
    check(args, Match.Optional(Array));

    try {
      const preparedFunc = vm.runInThisContext(
          '(function (require) { return (' + func + '); })'
      ).call(null, meteorInstall());
      const value = await preparedFunc.apply(global, args);

      return {
        value
      };
    } catch (error) {
      return {
        error: {
          message: error.toString(),
          stack: error.stack ? error.stack.toString() : '',
          code: func
        }
      };
    }
  }
});
