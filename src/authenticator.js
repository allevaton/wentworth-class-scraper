const url = require('url');

const request = require('request');
const cheerio = require('cheerio');

const loginUrl = 'https://prodweb2.wit.edu/ssomanager/c/SSB';
const authenticateUrl = 'https://cas.wit.edu';
const userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.82 Safari/537.36';

module.exports = class LeopardWebAuthenticator {
  constructor(username, password) {
    this.username = username;
    this.password = password;

    this.cookieJar = request.jar();
    this.request = request.defaults({
      jar: this.cookieJar,
      headers: {
        'User-Agent': userAgent
      },
      gzip: true
    });

    this.get = this.request.get
    this.post = this.request.post;
    this.put = this.request.put;
    this._authenticated = false;
  }

  get authenticated() {
    return this._authenticated;
  }

  set setPassword(password) {
    this.password = password;
  }

  set setUsername(username) {
    this.username = username;
  }

  authenticate(username = this.username, password = this.password) {
    if (!username)
      return Promise.reject('Username is required');

    if (!password)
      return Promise.reject('Password is required!');

    return new Promise((resolve, reject) => {
      this.request(loginUrl, (err, response, body) => {
        if (err)
          reject(err);

        let $ = cheerio.load(body);
        let form = $('form#fm1');

        let formData = { username, password };

        form.find('input[type=hidden]').each((i, hidden) => {
          // Fill the cookie jar with these hidden form elements
          let cookie = request.cookie(`${hidden.attribs.name}=${hidden.attribs.value}; Domain=wit.edu`);
          formData[hidden.attribs.name] = hidden.attribs.value;
          this.cookieJar.setCookie(cookie, authenticateUrl);
        });

        // TODO find out why Request is not properly following redirects
        let postUrl = url.resolve(authenticateUrl, form[0].attribs.action);
        this.request.post({
          url: postUrl,
          form: formData
        }, (err, response, body) => {
          if (err)
            reject(err);

          if (response.statusCode >= 300 && response.statusCode < 400) {
            // Follow the redirect manually, this cements the authentication
            this.request.get(response.headers.location, (err) => {
              if (err)
                reject(err);

              this._authenticated = true;
              resolve(true);
            });
          }
          else
            reject('Incorrect login');
        });
      });
    });
  }
}