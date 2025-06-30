const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('couple')
        .setDescription('Calcule la compatibilité entre deux personnes.')
        .addUserOption(option =>
            option.setName('romeo')
                .setDescription('Première personne')
                .setRequired(true)
        )
        .addUserOption(option =>
            option.setName('juliette')
                .setDescription('Deuxième personne')
                .setRequired(true)
        ),
    async execute(interaction) {
        const romeo = interaction.options.getUser('romeo');
        const juliette = interaction.options.getUser('juliette');

        // Génère un pourcentage basé sur les IDs pour que ce soit "pseudo-aléatoire"
        const seed = romeo.id + juliette.id;
        let hash = 0;
        for (let i = 0; i < seed.length; i++) {
            hash = seed.charCodeAt(i) + ((hash << 5) - hash);
        }
        const percent = Math.abs(hash % 101);

        await interaction.reply({
            content: `💞 Compatibilité entre ${romeo} et ${juliette} : **${percent}%** !`
        });
    }
};