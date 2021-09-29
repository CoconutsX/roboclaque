#!/usr/bin/node
const { decode } = require('html-entities');
const utf8 = require("utf8");

const TIMER = 60000; // 10 minutes

const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const Discord = require('discord.js');
const textToImage = require('text-to-image');

const intents = new Discord.Intents(561);
const client = new Discord.Client({ intents });

// If modifying these scopes, delete token.json.
const SCOPES = ['https://mail.google.com/'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';
client.once('ready', () => {
  console.log('Roboclaqué is online.');
  client.on('messageCreate', message => {
    if (message.channel.name.includes('wtf')) {
      if (message.content.includes(":samyyyyy:"))
        message.reply('<@116222636849102853>');
      if (message.content.includes(":florent_desespoir:"))
        message.reply('<@197054173512990720>');
      if (message.content.includes("djjslmajdldbdjs"))
        message.reply("<:monke:885801180142395412> <:monke:885801180142395412> <:monke:885801180142395412>");
      if (message.content.includes(":mondam:") || message.content.includes(":monke:"))
        message.reply('<@342589958160384002>');
      m = message.content.toLowerCase();
      if ((m.includes('tacos') || m.includes('t a c o s') || m.includes('t\na\nc\no\ns')) && (m.includes('lyon') || m.includes('l y o n') || m.includes('l\ny\no\nn')))
        message.delete();
      else if (m.includes('tacos') || m.includes('t a c o s') || m.includes('t\na\nc\no\ns') || m.includes("🌮"))
        message.reply('<@285051115266113537>');
    }
  });
  run();
  setInterval(() => {
    console.log('pass');
    // Load client secrets from a local file.
    fs.readFile('credentials.json', (err, content) => {
      if (err) return console.log('Error loading client secret file:', err);
      // Authorize a client with credentials, then call the Gmail API.

      authorize(JSON.parse(content), getMessages);

    });
  }, TIMER);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    return callback(oAuth2Client);
  });
}
function run(){
    console.log('pass');
    // Load client secrets from a local file.
    fs.readFile('credentials.json', (err, content) => {
      if (err) return console.log('Error loading client secret file:', err);
      // Authorize a client with credentials, then call the Gmail API.

      authorize(JSON.parse(content), getMessages);

    });
}
/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
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
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      return callback(oAuth2Client);
    });
  });
}

async function waitMessage(gmail, id) {
  var message = await gmail.users.messages.get({ userId: 'me', id: id, format: 'full' });
  return message;
}

function getMessages(auth) {
  const channel = client.channels.cache.get('882280481389961266'); //roboclaqué
  var channelProf = undefined;
  //const channel = msg.guild.channels.resolve(channelID);
  const gmail = google.gmail({ version: 'v1', auth });
  gmail.users.messages.list({
    userId: 'me',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const msgList = res.data.messages;
    if (msgList !== undefined && msgList.length) {
      msgList.forEach((m) => {
        waitMessage(gmail, m.id).then(message => {

          if (message.data.payload.parts !== undefined && message.data.payload.parts[0].body.data !== undefined) {
            console.log("parts");
            var body = atob(message.data.payload.parts[0].body.data.replace(/-/g, '+').replace(/_/g, '/'));
          }
          else if (message.data.payload.body !== undefined && message.data.payload.body.data !== undefined) {
            console.log("body");
            var body = atob(message.data.payload.body.data.replace(/-/g, '+').replace(/_/g, '/'));
          } else if (message.data.snippet != undefined) {
            console.log("snippet");
            var body = message.data.snippet;
          } else {
            var body = "Message sur les polypoints indisponible. Help me step bro !";
          }
          var sender = "unknown";
          if (message.data.payload.headers != undefined) {
            message.data.payload.headers.forEach((h) => {
              if (!'From'.localeCompare(h.name)) {
                sender = h.value;
              }
            });
          }
          var lowerBody = body.toLowerCase();
          var lowerSender = sender.toLowerCase();
          if(lowerSender.includes("didier.donsez")){
            channelProf = client.channels.cache.get('885464599388897310'); //bdd
          } else if (lowerSender.includes('jean-francois.monin')){
            channelProf = client.channels.cache.get('885793609327206442'); //ocaml
          } else if (lowerSender.includes('jonatha.anselmi')){
            channelProf = client.channels.cache.get("885432141108879400"); //proba
          } else if(lowerSender.includes('fabienne.boyer')){
            channelProf = client.channels.cache.get("885773396510654484"); //proc-concurrente
          } else if(lowerSender.includes("nadia.brauner")){
            channelProf = client.channels.cache.get("887300247133495296"); //recherche-op
          } else if(lowerSender.includes("renaud.blanch")){
            channelProf = client.channels.cache.get("887587902530396250"); //interaction homme machine
          } else if(lowerSender.includes("valentin.garnero")){
            channelProf = client.channels.cache.get("889437763412320277"); //complexité algo
          } else if(lowerSender.includes("olivier.richard")){
            channelProf = client.channels.cache.get("889521322504368188"); //réseaux
          }
          if (channelProf != undefined) { //prof
            channelProf.send(`Nouveau message de ${sender} ! <:rainbow:768468995161718785>`);
            body = decode(body);
            textToImage.generate(utf8.decode(body), { maxWidth: 1920, fontSize: 32 }).then(function (dataUri) {
              const sfbuff = new Buffer.from(dataUri.split(",")[1], "base64");
              channelProf.send({
                content: `Voici son message :⁣`, files: [
                  { attachment: sfbuff }
                ]
              });
            });
          }
          if (lowerBody.includes('polypoint') || lowerBody.includes('poly-point') || lowerBody.includes('point citoyen') || lowerBody.includes('points citoyen')) { //polypoint
            channel.send(`Nouveau message de ${sender} mentionnant les poly-points ! <:rainbow:768468995161718785>\n<@&889552215214260244>`);
            body = decode(body);
            textToImage.generate(utf8.decode(body), { maxWidth: 1920, fontSize: 32 }).then(function (dataUri) {
              const sfbuff = new Buffer.from(dataUri.split(",")[1], "base64");
              channel.send({
                content: `Voici son message :⁣`, files: [
                  { attachment: sfbuff }
                ]
              });
            });
          }
          gmail.users.messages.trash({ userId: 'me', id: m.id });
          console.log("message trashed");
        });
      });
    } else {
      console.log('No messages found.');
    }
  });
}
client.login('haha lol non');
