const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('market')
        .setDescription(
            "Ouvrir la boutique exp (vous permet d'acheter des améliorations)."
        ),
    cooldown: 5,
    async execute(interaction) {

        await interaction.reply({
            embeds: [{
                color: process.env.ERROR_COLOR,
                description: "`🧪` Cette commande n'est pas encore disponible ! Soyez avertis de sa mise en fonctions dans <#1380409583134179449>."
            }]
        })
    },
};