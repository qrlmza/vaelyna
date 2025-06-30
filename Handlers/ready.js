require('dotenv').config();
const { PresenceUpdateStatus, ActivityType } = require('discord.js');

const updateStatus = async (client) => {
    try {
        const totalMembers = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
        
        await client.user.presence.set({
            status: PresenceUpdateStatus.Online,
            activities: [{
                type: ActivityType.Custom,
                name: `🍋 Watching ${totalMembers} members`,
            }]
        });
        
        console.log(`\x1b[36m ⟭ Status updated: Watching ${totalMembers} members`);
    } catch (error) {
        console.error('\x1b[31m ⟭ Error updating status:', error);
    }
};

const readyHandler = (client) => {
    client.once('ready', async () => {
        const username = client.user?.username;
        console.log(`\x1b[32m ⟭ The application started successfully with the username ${username}.`);
        
        await updateStatus(client);
        
        setInterval(() => updateStatus(client), 300000);
    });
};

module.exports = readyHandler;