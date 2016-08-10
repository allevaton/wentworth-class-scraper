const Authenticator = require('./authenticator');

module.exports = class Scraper {
  constructor(username = '', password = '') {
    this.authenticator = new Authenticator(username, password);
  }
  
  
}