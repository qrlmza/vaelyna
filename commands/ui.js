const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ui')
        .setDescription('🔎 → ui'),

    async execute(interaction) {
        
        interaction.reply("ui");
    }
};