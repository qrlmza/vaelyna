const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, MessageFlags } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription("Permet d'obtenir la liste complète des commandes."),
    cooldown: 5,
    async execute(interaction) {
        const commandsPath = path.join(process.cwd(), 'commands');
        const categories = fs.readdirSync(commandsPath).filter(dir => fs.statSync(path.join(commandsPath, dir)).isDirectory());

        const botMention = `<@${interaction.client.user.id}>`;
        const devMention = `<@${process.env.SELU_ID}>`;

        const embed = new EmbedBuilder()
            .setTitle('🍋 Vaelyna Help Menu')
            .setDescription(
                `Bienvenue sur le menu d'aide de ${botMention} !\n\n` +
                `**Utilisation :** Sélectionne une catégorie dans le menu déroulant ci-dessous pour voir toutes les commandes disponibles.\n\n` +
                `> \uD83D\uDCBB **GitHub :** [Voir le dépôt](https://github.com/qrlmza/vaelyna)\n` +
                `> 👤 **Développeur :** ${devMention}\n\n` +
                `\u2753 *Besoin d'aide supplémentaire ? Contacte le développeur ou ouvre une issue sur GitHub.*`
            )
            .setColor(Number(process.env.INFO_COLOR))
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .setFooter({ text: `Nombre de catégories : ${categories.length} • Vaelyna`, iconURL: interaction.client.user.displayAvatarURL() });

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('help-category-select')
            .setPlaceholder('Choisis une catégorie')
            .addOptions(categories.map(cat => ({
                label: cat,
                value: cat,
                description: `Voir les commandes de la catégorie ${cat}`
            })));

        const row = new ActionRowBuilder().addComponents(selectMenu);

        await interaction.reply({ embeds: [embed], components: [row], flags: MessageFlags.Ephemeral });

        // Gestion de l'update de l'embed lors de la sélection d'une catégorie
        const filter = i => i.customId === 'help-category-select' && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            const selectedCategory = i.values[0];
            const commandsPath = path.join(process.cwd(), 'commands', selectedCategory);
            let commandFiles = [];
            try {
                commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
            } catch (e) {
                return i.update({ content: 'Catégorie invalide ou inaccessible.', embeds: [], components: [], flags: MessageFlags.Ephemeral });
            }

            const commandIdMap = interaction.client.commandIdMap || {};
            const commandList = commandFiles.map(file => {
                const command = require(path.join(commandsPath, file));
                const id = commandIdMap[command.data.name] || '000000000000000000';
                return `</${command.data.name}:${id}> : ${command.data.description}`;
            }).join('\n');
            const categoryEmbed = new EmbedBuilder()
                .setTitle(`Commandes de la catégorie : ${selectedCategory}`)
                .setDescription(commandList || 'Aucune commande trouvée dans cette catégorie.')
                .setColor(Number(process.env.INFO_COLOR))
                .setFooter({ text: `Catégorie : ${selectedCategory} • Vaelyna`, iconURL: interaction.client.user.displayAvatarURL() });
            await i.update({ embeds: [categoryEmbed], components: [row], flags: MessageFlags.Ephemeral });
        });
    },
};