const Discord = require('discord.js');
require('dotenv').config();

const guildUserLeave = (client) => {
    const InviteManager = require('discord-invite');
    const invClient = new InviteManager(client);

    client.on("guildMemberRemove", async(member, inviter, invite) => {
        if(!inviter) {
            console.log(`\x1b[33m ⟭ ${member.user.username} Lefted the server, but I couldn't find out who was invited.`);
        } else if(member.id == inviter.id) {
            console.log(`\x1b[33m ⟭ ${member.user.username} Lefted the server by his own invitation!`);
        } else if(member.guild.vanityURLCode == inviter) {
            console.log(`\x1b[33m ⟭ ${member.user.username} Lefted Server Using Vanity URL!`);
        } else {
            invClient.inviteRemove(member.guild.id, inviter,1);
            console.log(`\x1b[33m ⟭ ${member.user.username} Lefted the server! inviter ${inviter.username}`);
        };
    });
}

module.exports = guildUserLeave;