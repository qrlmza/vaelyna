const { SlashCommandBuilder, MessageFlags } = require('discord.js');

function parseDuration(str) {
    // Exemples acceptés : 10s, 5m, 2h
    const match = str.match(/^(\d+)(s|m|h)$/);
    if (!match) return null;
    const value = parseInt(match[1]);
    const unit = match[2];
    if (unit === 's') return value * 1000;
    if (unit === 'm') return value * 60 * 1000;
    if (unit === 'h') return value * 60 * 60 * 1000;
    return null;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remind')
        .setDescription('Envoie un rappel après un certain temps (en DM).')
        .addStringOption(option =>
            option.setName('temps')
                .setDescription('Exemple : 10s, 5m, 2h')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Le message à rappeler')
                .setRequired(true)
        ),
    async execute(interaction) {
        const temps = interaction.options.getString('temps');
        const message = interaction.options.getString('message');
        const duration = parseDuration(temps);

        if (!duration) {
            return interaction.reply("Format du temps invalide. Utilise par exemple : 10s, 5m ou 2h.");
        }

        try {
            await interaction.user.send(`⏰ Je te rappellerai : "${message}" dans ${temps}.`);
        } catch (err) {
            return interaction.reply({
                content: "Je ne peux pas t'envoyer de DM. Active tes messages privés pour utiliser cette commande.",
                flags: MessageFlags.Ephemeral
            });
        }

        await interaction.reply({
            content: "Rappel programmé ! Tu recevras un DM.",
            flags: MessageFlags.Ephemeral
        });

        setTimeout(async () => {
            try {
                await interaction.user.send(`🔔 Rappel : ${message}`);
            } catch (err) {
                // DM bloqué après coup, rien à faire
            }
        }, duration);
    }
};