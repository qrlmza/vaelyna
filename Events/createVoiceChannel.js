const Discord = require('discord.js');

const createVoiceChannel = (client) => {
    client.on('voiceStateUpdate', async (oldState, newState) => {
        const triggerChannelId = process.env.CREATE_VOICE_CHANNEL;

        if (!oldState.channelId && newState.channelId === triggerChannelId) {
            try {
                const newChannel = await newState.guild.channels.create({
                    name: `⌡ Salon de ${newState.member.displayName}`,
                    type: Discord.ChannelType.GuildVoice,
                    parent: newState.channel.parent,
                    permissionOverwrites: [
                        {
                            id: newState.guild.id,
                            allow: [Discord.PermissionFlagsBits.ViewChannel, Discord.PermissionFlagsBits.Connect]
                        },
                        {
                            id: newState.member.id,
                            allow: [
                                Discord.PermissionFlagsBits.ViewChannel,
                                Discord.PermissionFlagsBits.Connect,
                                Discord.PermissionFlagsBits.ManageChannels,
                                Discord.PermissionFlagsBits.MoveMembers
                            ]
                        }
                    ]
                });

                await newState.member.voice.setChannel(newChannel);

                const checkEmpty = setInterval(async () => {
                    const updatedChannel = await newChannel.fetch();
                    if (updatedChannel.members.size === 0) {
                        await updatedChannel.delete();
                        clearInterval(checkEmpty);
                    }
                }, 10000);

            } catch (error) {
                console.error('⚠️ → Erreur lors de la création/déplacement de l\'utilisateur dans un tempvoice : ', error);
            }
        }
    });
}

module.exports = createVoiceChannel();