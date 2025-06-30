const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription(
            "Vous permet d'obtenir l'avatar d'un utilisateur."
        )
        .addUserOption(option => 
            option
                .setName("utilisateur")
                .setDescription("Utilisateur cible")
                .setRequired(false)
        ),
    cooldown: 5,
    async execute(interaction) {

        const user = interaction.options.getUser('utilisateur') || interaction.user;
        const avatarURL = user.displayAvatarURL({ size: 1024, dynamic: true });

        interaction.reply({
            embeds: [{
                author: {
                    name: interaction.user.username,
                    iconURL: interaction.user.displayAvatarURL({ size: 1024, dynamic: true })
                },
                image: {
                    url: avatarURL
                },
                color: parseInt(process.env.INFO_COLOR),
                timestamp: new Date().toISOString(),
            }]
        })
    },
};