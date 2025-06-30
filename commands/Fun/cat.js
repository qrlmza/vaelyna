const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cat')
        .setDescription('Tout le monde aime les chats (mais on préfère les panda roux)'),
    cooldown: 5,
    async execute(interaction) {

        try {
            const response = await fetch('https://api.thecatapi.com/v1/images/search?mime_types=gif');
            const data = await response.json();
            if (data[0] && data[0].url) {
                interaction.reply({
                    embeds: [{
                        image: { url: data[0].url },
                        color: parseInt(process.env.INFO_COLOR),
                    }]
                });
            } else {
                interaction.reply({
                    embeds: [{
                        color: parseInt(process.env.ERROR_COLOR),
                        description: `${process.env.CROSS} Je n'arrive pas à vous envoyer un chat pour le moment... Essayez plus tard.`
                    }],
                    flags: MessageFlags.Ephemeral
                });
            }
        } catch (error) {
            interaction.reply({
                embeds: [{
                    color: parseInt(process.env.ERROR_COLOR),
                    description: `${process.env.CROSS} Une erreur est survenue lors de l'execution de l'envoie.`
                }],
                flags: MessageFlags.Ephemeral
            });
        }
    },
};