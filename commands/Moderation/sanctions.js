const { SlashCommandBuilder, MessageFlags, EmbedBuilder } = require('discord.js');
const db = require('../../db');
const staffRoleId = process.env.STAFF_ROLE;
const red = parseInt(process.env.ERROR_COLOR);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sanctions')
        .setDescription(
            "[STAFF] Permet aux modérateurs de voir la liste des sanctions d'un membre."
        )
        .addUserOption(option =>
            option
                .setName("utilisateur")
                .setDescription("Utilisateur cible")
                .setRequired(true)
        ),
    cooldown: 5,
    async execute(interaction) {
        if (!interaction.member.roles.cache.has(staffRoleId)) {
            return interaction.reply({
                content: "⛔ Tu n'as pas la permission d'effectuer cette commande.",
                flags: MessageFlags.Ephemeral
            });
        }

        const user = interaction.options.getUser("utilisateur");
        const userId = user.id;

        const [sanctionsRow] = await db.execute(
            'SELECT * FROM sanctions WHERE user = ? ORDER BY date DESC',
            [userId]
        );

        if (!sanctionsRow || sanctionsRow.length === 0) {
            return interaction.reply({
                content: `✅ Aucune sanction trouvée pour **${user.tag}**.`,
                flags: MessageFlags.Ephemeral
            });
        }

        const embed = new EmbedBuilder()
            .setColor(red)
            .setTitle(`📋 Sanctions de ${user.tag}`)
            .setThumbnail(user.displayAvatarURL())
            .setFooter({ text: `ID utilisateur : ${user.id}` });

        let desc = '';
        sanctionsRow.forEach((sanction, index) => {
            desc += `### ⚠️ Sanction #${index + 1}\n`;
            desc += `**Type :** \`${sanction.type.toUpperCase()}\`${sanction.canceled ? ' ❌ *(annulée)*' : ''}\n`;
            desc += `**Raison :** ${sanction.reason}\n`;
            desc += `**Modérateur :** <@${sanction.author}>\n`;
            desc += `**Date :** <t:${Math.floor(new Date(sanction.date).getTime() / 1000)}:F>\n`;
            if (sanction.canceled && sanction.cancel_date) {
                desc += `**Annulée le :** <t:${Math.floor(new Date(sanction.cancel_date).getTime() / 1000)}:F>\n`;
            }
            desc += `\n`;
        });

        embed.setDescription(desc.slice(0, 4096));

        interaction.reply({
            embeds: [embed],
            flags: MessageFlags.Ephemeral
        });
    },
};