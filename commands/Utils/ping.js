const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription(
            "Répond avec la latence du bot et de l\'api de Discord."
        ),
    cooldown: 5,
    async execute(interaction) {

        const sent = await interaction.reply('Pinging...');
        const latency = sent.createdTimestamp - interaction.createdTimestamp;

        sent.edit(`Pong! Latency is ${latency}ms. API Latency is ${Math.round(interaction.client.ws.ping)}ms.`);
    },
};