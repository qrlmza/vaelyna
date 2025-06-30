const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Affiche des informations sur un utilisateur.')
        .addUserOption(option =>
            option.setName('utilisateur')
                .setDescription('L\'utilisateur à inspecter')
                .setRequired(false)
        ),
    async execute(interaction) {
        const user = interaction.options.getUser('utilisateur') || interaction.user;
        const member = await interaction.guild.members.fetch(user.id);

        const embed = {
            color: parseInt(process.env.INFO_COLOR),
            title: `👤 Informations sur ${user.tag}`,
            thumbnail: { url: user.displayAvatarURL({ dynamic: true }) },
            fields: [
                { name: '🆔 ID', value: user.id, inline: false },
                { name: '👾 Pseudo', value: user.username, inline: true },
                { name: '#️⃣ Tag', value: `#${user.discriminator}`, inline: true },
                { name: '📅 Créé le', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`, inline: false },
                { name: '📥 A rejoint le serveur', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`, inline: false },
                { name: '🤖 Bot ?', value: user.bot ? 'Oui' : 'Non', inline: true }
            ]
        };

        await interaction.reply({ embeds: [embed]});
    }
};