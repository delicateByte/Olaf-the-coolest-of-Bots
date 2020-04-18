const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const urlOpen = require('open');
const path = require('path');

class GoogleAuthentication {
  private scopes = ['https://www.googleapis.com/auth/calendar.readonly'];
  private tokenPath = './localstorage/settings/token.json';
  private isFree;
  private filePath = '../../../credentials.json';

  public async getAccessToken(oAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: this.scopes,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    urlOpen(authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        // eslint-disable-next-line consistent-return
        fs.writeFile(this.tokenPath, JSON.stringify(token), (errWriting) => {
          if (errWriting) return console.error(errWriting);
          console.log('Token stored to', this.tokenPath);
        });
        return oAuth2Client;
      });
    });
  }

  public async authorize(credentials) {
    console.log('Authorizing');
    // camelCase check is disabled due to naming of auto generated credentials file!!!
    // eslint-disable-next-line @typescript-eslint/camelcase
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0],
    );
    // Check if we have previously stored a token.
    fs.readFile(this.tokenPath, (err, token) => {
      if (err) return this.getAccessToken(oAuth2Client);
      oAuth2Client.setCredentials(JSON.parse(token));
      return oAuth2Client;
    });
  }

  public async getCredentials(): Promise<Object> {
    // eslint-disable-next-line no-new
    let credentials;
    console.log('Getting credentials');
    fs.readFile(path.resolve(__dirname, this.filePath), (err, content) => {
      if (err) return console.log('Error loading client secret file: ', err);
      credentials = JSON.parse(content);
    });
    return credentials;
    // console.log('Getting credentials');
    // fs.readFile(path.resolve(__dirname, this.filePath), (err, content) => {
    //   if (err) return console.log('Error loading client secret file: ', err);
    //   const credentials = JSON.parse(content);
    //   return Promise.resolve(credentials);
    // });
  }
}
export default GoogleAuthentication;
