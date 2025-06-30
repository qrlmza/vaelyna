const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const info = parseInt(process.env.INFO_COLOR);

function generateConfessionId() {
    // Génère un ID court basé sur la date et un nombre aléatoire
    return (
        Date.now().toString(36) +
        Math.random().toString(36).substr(2, 4)
    ).toUpperCase();
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('confession')
        .setDescription('Envoie une confession anonyme dans le salon dédié.')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Ta confession')
                .setRequired(true)
        ),
    async execute(interaction) {
        const confession = interaction.options.getString('message');
        const channelId = process.env.CONFESS_CHANNEL;
        const channel = interaction.client.channels.cache.get(channelId);

        if (!channel) {
            return interaction.reply({
                content: "Le salon de confessions n'a pas été trouvé. Merci de contacter un administrateur.",
                flags: MessageFlags.Ephemeral
            });
        }

        const confessionId = generateConfessionId();
        console.log(`\x1b[34m ⟭ New confession → ID: ${confessionId} | User: ${interaction.user.username}`);

        await channel.send({
            embeds: [{
                title: "💬 Nouvelle confession anonyme",
                description: `> *${confession}*`,
                color: info,
                footer: { text: `${confessionId}` },
                timestamp: new Date().toISOString(),
            }]
        });

        await interaction.reply({
            content: "Ta confession a bien été envoyée de façon anonyme !",
            flags: MessageFlags.Ephemeral
        });
    }
};