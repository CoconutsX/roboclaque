#!/usr/bin/node
const { decode } = require('html-entities');
const utf8 = require("utf8");

var aleat = 0;

const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const Discord = require('discord.js');
const textToImage = require('text-to-image');
const intents = new Discord.Intents(24331);

const client = new Discord.Client({ intents });

// If modifying these scopes, delete token.json.
const SCOPES = ['https://mail.google.com/'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

var config = loadConfig();
var ratio_rate = config.ratio_rate;

function loadConfig() {
  var content = fs.readFileSync("config.json");
  return JSON.parse(content);
}

function sendReaction(message, reactions) {
  var m = message.content.toLowerCase();
  for (var react of reactions) {
    if (m.includes(react.content)) {
      switch (react.type) {
        case "react":
          message.react(react.response);
          break;
        case "reply":
          message.reply(react.response);
          break;
      }
    }
  }
}

client.once('ready', () => {
  console.log('Roboclaqué is online.');
  aleat = Math.floor(Math.random() * ratio_rate);
  client.on('messageCreate', message => {
    if (message.author.id !== "881468394451386368") {
      aleat = Math.floor(Math.random() * ratio_rate);
      // aleat
      if (aleat == 0)
        message.reply("ratio <:very_yum:889548174384046220>");

      // commands
      if (message.content.includes("!pat"))
        message.reply("UwU ~❤️ https://cdn.discordapp.com/attachments/776436274927632405/902566162552983563/pet_robo.gif");

      if (message.content.includes('!change-ratio-rate')) {
        var param = message.content.split(" ");
        ratio_rate = parseInt(param[1]);
        message.reply("ok");
      }
      if (message.content.includes("!reload-config")) {
        config = loadConfig();
        ratio_rate = config.ratio_rate;
        message.reply("Configuration rechargée");
      }
      // shitpost
      sendReaction(message, config.reactions.global);
      if (message.channel.name.includes(config.reaction_channel)) {
        sendReaction(message, config.reactions.channel);
        m = message.content.toLowerCase();
        if ((m.includes('tacos') || m.includes('t a c o s') || m.includes('t\na\nc\no\ns')) && (m.includes('lyon') || m.includes('l y o n') || m.includes('l\ny\no\nn')))
          message.delete();
        else if (m.includes('tacos') || m.includes('t a c o s') || m.includes('t\na\nc\no\ns') || m.includes("🌮"))
          message.reply('<@285051115266113537>');
      }
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
  }, config.mail_timer * 1000);
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
function run() {
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
          for (var email of config.email) {
            if (lowerSender.includes(email.sender)) {
              channelProf = client.channels.cache.get(email.channel_id);
            }
          }
          if (channelProf != undefined) { //prof
            try {
              channelProf.send(`Nouveau message de ${sender} ! <:rainbow:768468995161718785>`);
              body = decode(body);
              var content;
              try {
                content = utf8.decode(body);
              } catch (e) {
                content = `Erreur de décodage du mail\n${e.message}`;
              }
              textToImage.generate(content, { maxWidth: 1920, fontSize: 32 }).then(function (dataUri) {
                const sfbuff = new Buffer.from(dataUri.split(",")[1], "base64");
                channelProf.send({
                  content: `Voici son message :⁣`, files: [
                    { attachment: sfbuff }
                  ]
                });
              });
            } catch (e) {
              console.log(`Can't send message notification:\n${e.message}`);
            }
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
client.login('nope');

