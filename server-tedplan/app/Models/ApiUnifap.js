'use strict'
const { google } = require('googleapis')
const fs = require('fs')
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')


class ApiUnifap extends Model {
  
  static get connection() { return 'api_unifap' }
  
  
  static OAuth2(){

    const SCOPES = [
      'https://www.googleapis.com/auth/admin.directory.user',
      'https://www.googleapis.com/auth/admin.directory.user.readonly',
      'https://www.googleapis.com/auth/cloud-platform',    
    ];      

      const TOKEN_PATH = 'token.json';

      const credentials = fs.readFileSync('./credentials.json', (err, content) => {
        if (err) return console.error('Error loading client secret file', err);       
      });    
    

    function authorize(credentials) {
      
      const {client_secret, client_id, redirect_uris} = credentials.web;
      const oauth2Client = new google.auth.OAuth2(
          client_id, client_secret, redirect_uris[0]);
        
      const token = fs.readFileSync(TOKEN_PATH, (err, token) => {        
        if (err) return getNewToken(oauth2Client);        
      });

      oauth2Client.credentials = JSON.parse(token);        
      return oauth2Client;
    }
   
    function getNewToken(oauth2Client) {
      const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
      });
      console.log('Authorize this app by visiting this url:', authUrl);
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oauth2Client.getToken(code, (err, token) => {
          if (err) return console.error('Error retrieving access token', err);
          oauth2Client.credentials = token;          
          storeToken(token);
          return oauth2Client;
        });
      });

    }

    function storeToken(token) {
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.warn(`Token not stored to ${TOKEN_PATH}`, err);
        console.log(`Token stored to ${TOKEN_PATH}`);
      });
    }


    return authorize(JSON.parse(credentials));
  }
  

}



module.exports = ApiUnifap
