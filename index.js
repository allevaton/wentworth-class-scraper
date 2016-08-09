'use strict';

const fs = require('fs');
const LeopardWebAuthenticator = require('./src/authenticator');

if (require.main === module) {
  fs.readFile('creds', (e, data) => {
    let [username, password] = data.toString().split('\n');
    let authenticator = new LeopardWebAuthenticator(username, password)
    authenticator.authenticate()
      .then(() => {
        authenticator.get('https://prodweb2.wit.edu/SSBPROD/twbkwbis.P_GenMenu?name=bmenu.P_RegMnu', (err, response, body) => {
          debugger;
        });
      })
      .catch(err => {
        console.error(err);
      });
  });

}
else {
  module.exports = {
    LeopardWebAuthenticator
  }
}