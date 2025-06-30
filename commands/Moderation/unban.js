const { SlashCommandBuilder, MessageFlags, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const db = require('../../db');
const warn = parseInt(process.env.WARN_COLOR);
const red = parseInt(process.env.ERROR_COLOR);
const green = parseInt(process.env.SUCCESS_COLOR);
const info = parseInt(process.env.INFO_COLOR);
const staffRoleId = process.env.STAFF_ROLE;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription("[STAFF] Affiche la liste des utilisateurs bannis pour débannissement."),
    cooldown: 5,
    async execute(interaction) {
        if(!interaction.member.roles.cache.has(staffRoleId)) {
            if (!interaction.replied && !interaction.deferred) {
                return interaction.reply({
                    content: "Mh, Tu n'as pas la permission de faire ce genre de choses.",
                    flags: MessageFlags.Ephemeral
                });
            } else {
                return interaction.followUp({
                    content: "Mh, Tu n'as pas la permission de faire ce genre de choses.",
                    flags: MessageFlags.Ephemeral
                });
            }
        }
        try {
            const bans = await interaction.guild.bans.fetch();
            if (bans.size === 0) {
                if (!interaction.replied && !interaction.deferred) {
                    return interaction.reply({
                        content: "Aucun utilisateur n'est actuellement banni du serveur.",
                        flags: MessageFlags.Ephemeral
                    });
                } else {
                    return interaction.followUp({
                        content: "Aucun utilisateur n'est actuellement banni du serveur.",
                        flags: MessageFlags.Ephemeral
                    });
                }
            }
            const options = [];
            let count = 0;
            for (const [userId, banInfo] of bans) {
                if (count >= 25) break;
                const banReason = banInfo.reason || "Aucune raison spécifiée";
                const shortReason = banReason.length > 50 ? banReason.substring(0, 47) + "..." : banReason;
                options.push(
                    new StringSelectMenuOptionBuilder()
                        .setLabel(banInfo.user.tag)
                        .setDescription(shortReason)
                        .setValue(banInfo.user.id)
                        .setEmoji('🔨')
                );
                count++;
            }
            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId('unban_select')
                .setPlaceholder('Choisissez un utilisateur à débannir...')
                .addOptions(options);
            const row = new ActionRowBuilder().addComponents(selectMenu);
            if (!interaction.replied && !interaction.deferred) {
                return interaction.reply({
                    embeds: [{
                        color: red,
                        title: `🔨 Utilisateurs bannis (${bans.size})`,
                        description: `Voici la liste des utilisateurs actuellement bannis du serveur.\nSélectionnez un utilisateur dans le menu ci-dessous pour le débannir.`,
                        footer: {
                            text: `${bans.size > 25 ? 'Affichage des 25 premiers résultats' : 'Tous les utilisateurs bannis'}`,
                            iconURL: interaction.guild.iconURL()
                        }
                    }],
                    components: [row],
                    flags: MessageFlags.Ephemeral
                });
            } else {
                return interaction.followUp({
                    embeds: [{
                        color: red,
                        title: `🔨 Utilisateurs bannis (${bans.size})`,
                        description: `Voici la liste des utilisateurs actuellement bannis du serveur.\nSélectionnez un utilisateur dans le menu ci-dessous pour le débannir.`,
                        footer: {
                            text: `${bans.size > 25 ? 'Affichage des 25 premiers résultats' : 'Tous les utilisateurs bannis'}`,
                            iconURL: interaction.guild.iconURL()
                        }
                    }],
                    components: [row],
                    flags: MessageFlags.Ephemeral
                });
            }
        } catch (error) {
            if (!interaction.replied && !interaction.deferred) {
                return interaction.reply({
                    content: "Une erreur est survenue lors de la récupération de la liste des utilisateurs bannis.",
                    flags: MessageFlags.Ephemeral
                });
            } else {
                return interaction.followUp({
                    content: "Une erreur est survenue lors de la récupération de la liste des utilisateurs bannis.",
                    flags: MessageFlags.Ephemeral
                });
            }
        }
    },
};