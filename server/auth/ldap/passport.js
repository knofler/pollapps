var passport = require('passport');
var LdapStrategy = require('passport-ldapauth').Strategy;

console.log("LdapStrategy : ",  LdapStrategy)

exports.setup = function (User, config) {
  passport.use(new LdapStrategy({
      usernameField: 'email',
      passwordField: 'password',
      server: {
        url: 'ldap://:389',
        bindDn: "",
        bindCredentials: "",
        searchBase: 'OU=,OU=,DC=,DC=,DC=,DC=,DC=',
        searchFilter: 'uid={{usernameField}}'
      }
    },
    function (user, done) {  
      return done(null, user);
    }
  ));
};