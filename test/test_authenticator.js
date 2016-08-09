const fs = require('fs');
const expect = require('expect');

const LeopardWebAuthenticator = require('../src/authenticator');

describe('leopardweb authenticator', () => {
  it('should fail with bad credentials from the constructor', () => {
    let auth = new LeopardWebAuthenticator('test', 'test');
    return auth.authenticate()
      .then(r => {
        expect(r).toNotBe(true);
      })
      .catch(err => {
        expect(err).toEqual('Incorrect login')
      });
  });

  it('should fail with bad credentials in the auth function', () => {
    let auth = new LeopardWebAuthenticator();
    return auth.authenticate('test', 'test')
      .then(r => {
        expect(r).toNotBe(true);
      })
      .catch(err => {
        expect(err).toEqual('Incorrect login')
      });
  });

  it('should read from `creds` correct login info, and login properly', () => {
    let data = fs.readFileSync('creds');
    let [username, password] = data.toString().split('\n');

    let authenticator = new LeopardWebAuthenticator(username, password)
    return authenticator.authenticate()
      .then(r => {
        expect(r).toEqual(true);
      })
      .catch(err => {
        expect(err).toNotExist()
      });
  });
});