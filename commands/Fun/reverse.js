const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reverse')
        .setDescription('Retourne le texte envoyé.')
        .addStringOption(option =>
            option.setName('texte')
                .setDescription('Le texte à inverser')
                .setRequired(true)
        ),
    async execute(interaction) {
        const text = interaction.options.getString('texte');
        const reversed = text.split('').reverse().join('');
        await interaction.reply(`${reversed}`);
    }
};