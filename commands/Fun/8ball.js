const { SlashCommandBuilder } = require('discord.js');

const responses = [
    "Oui.", "Non.", "Peut-être.", "Certainement !", "Je ne pense pas.", "Demande plus tard.", 
    "C'est possible.", "Absolument pas.", "Sans aucun doute.", "Je ne peux pas répondre maintenant."
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('Pose une question à la boule magique !')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('Ta question')
                .setRequired(true)
        ),
    async execute(interaction) {
        const question = interaction.options.getString('question');
        const answer = responses[Math.floor(Math.random() * responses.length)];
        await interaction.reply(`🎱 **Question :** ${question}\n**Réponse :** ${answer}`);
    }
};