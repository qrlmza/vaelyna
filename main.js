/*
 *
 * Welcome to the V2 of Vaelyna !
 * This Discord bot has been developed by Selunik
 * 
 * Support : https://discord.gg/bPh8PDHKHb
 *
 */

const Discord = require('discord.js');
require('dotenv').config();
const TOKEN = process.env.TOKEN;

const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.MessageContent,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.GuildPresences,
        Discord.GatewayIntentBits.GuildVoiceStates
    ]
});

client.commands = new Discord.Collection();

const readyHandler = require('./Handlers/ready');
const commandsHandler = require('./Handlers/commands');
const guildUserAdd = require('./Events/guildUserJoin');
const levelSystem = require('./Events/levelSystem');
const customVoiceCreate = require('./Events/levelSystem');
const bumpReminder = require('./Events/bumpRemind');
const guildUserLeave = require('./Events/guildUserLeave');

readyHandler(client);
commandsHandler(client);
guildUserAdd(client);
levelSystem(client);
bumpReminder(client);
customVoiceCreate(client);
guildUserLeave(client);

client.login(TOKEN);