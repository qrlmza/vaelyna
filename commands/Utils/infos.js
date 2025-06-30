const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const BOT_INFO = {
    version: require('../../package.json').version,
    developer: "<@855168612323164210>",
    supportServer: "https://discord.gg/kpegty9a",
    sourceCode: "https://github.com/qrlmza/vaelyna"
};


module.exports = {
    data: new SlashCommandBuilder()
        .setName('infos')
        .setDescription(
            "Permet d'obtenir les différentes informations sur le bot."
        ),
    cooldown: 5,
    async execute(interaction) {

        const { user } = interaction.client;
        const avatarURL = user.displayAvatarURL({ dynamic: true });
        
        const embed = new EmbedBuilder()
            .setColor(parseInt(process.env.INFO_COLOR))
            .setAuthor({ name: user.username, iconURL: avatarURL })
            .addFields([
                { name: '📁 Version', value: BOT_INFO.version, inline: true },
                { name: '🙎 Développeur', value: BOT_INFO.developer, inline: true },
                { name: '🎫 Serveur de support', value: BOT_INFO.supportServer, inline: true },
                { name: '🗃️ Code source', value: BOT_INFO.sourceCode, inline: true }
            ])
            .setTimestamp()
            .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 1024 }));

        await interaction.reply({ embeds: [embed] });
    },
};