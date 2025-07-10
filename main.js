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
const inviteCache = new Map();

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

// update the invitions cache
async function updateInviteCache(guild) {
    try {
        const invites = await guild.invites.fetch();
        const inviteMap = new Map();

        invites.forEach(invite => {
            inviteMap.set(invite.code, invite.users);
        });

        inviteCache.set(guild.id, inviteMap);
    } catch (error) {
        console.error("\x1b[31m ⟭ An error occured while requesting invitations : ", error);
    }
}

async function initInviteCache() {
    for (const guild of client.guilds.cache.values()) {
        await updateInviteCache(guild);
    }
}

client.once('ready', async () => {
    await initInviteCache();
    console.log('\x1b[32m ⟭ Invite cache initialized !');
});

// when an invitation has benn created :
client.on(Discord.Events.InviteCreate, async (invite) => {
    await updateInviteCache(invite.guild);
});

// when an invitation has been deleted :
client.on(Discord.Events.InviteDelete, async (invite) => {
    await updateInviteCache(invite.guild);
});

client.login(TOKEN);