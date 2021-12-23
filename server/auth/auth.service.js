const { OAuth2Client } = require('google-auth-library');
const keys = require('../keys.json');
const { youtube } = require('@googleapis/youtube');

const AUTH_URL_CONFIG = {
  access_type: 'offline',
  scope: ['https://www.googleapis.com/auth/youtube', 'https://www.googleapis.com/auth/youtube.readonly']
};

class AuthService {

  #accessToken;
  #youtubeAPI;

  constructor() {
    this.oAuth2Client = new OAuth2Client(
      keys.web.client_id,
      keys.web.client_secret,
      keys.web.redirect_uris[0]
    );

    this.#accessToken = null;

    this.#youtubeAPI = youtube({
      version: 'v3',
      auth: this.oAuth2Client
    });
  }

  getAuthorizeUrl() {
    return this.oAuth2Client.generateAuthUrl(AUTH_URL_CONFIG);
  }

  async getTokens(code) {
    const r = await this.oAuth2Client.getToken(code);
    return r.tokens;
  }

  setCredentials(tokens) {
    this.#accessToken = tokens.access_token;
    this.oAuth2Client.setCredentials(tokens);
  }

  getAccessToken() {
    return this.#accessToken;
  }

  getYoutubeApi() {
    return this.#youtubeAPI;
  }

  async validateToken() {
    let isTokenValid = false;
    try {
      await this.oAuth2Client.getTokenInfo(this.#accessToken);
      isTokenValid = true;
    } catch (err) {

    }
    return isTokenValid;
  }

}

module.exports = new AuthService();