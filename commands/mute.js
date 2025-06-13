const { SlashCommandBuilder, MessageFlags, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('🔇 → Permet de rendre muet un utilisateur.')
        .addUserOption(option =>
            option.setName("utilisateur")
                .setDescription("Utilisateur à rendre muet")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("raison")
                .setDescription("Raison de la sanction")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("durée")
                .setDescription("durée de la sanction (ex: 10m, 1h, 2d)")
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        const targetUser = interaction.options.getUser("utilisateur");
        const targetMember = interaction.guild.members.cache.get(targetUser.id);
        const reason = interaction.options.getString("raison");
        const duration = interaction.options.getString("durée") || null;

        if(!targetMember) {
            return await interaction.reply({
                content: "Je n'arrives pas à trouver l'utilisateur mentionné. 🙂‍↔️",
                flags: MessageFlags.Ephemeral
            });
        }

        if(targetUser.id === interaction.user.id) {
            return await interaction.reply({
                content: "Je pense que vous rendre muet vous même n'est pas la meilleure idée. 🙂‍↔️",
                flags: MessageFlags.Ephemeral
            });
        }

        if(targetUser.id === interaction.client.user.id) {
            return await interaction.reply({
                content: "Tu essaies réellement de me rendre muet moi ? Tu es fou ? 😒",
                flags: MessageFlags.Ephemeral
            });
        }

        if (targetMember.roles.highest.position >= interaction.member.roles.highest.position) {
            return await interaction.reply({
                content: "Mh, tu essaie de rendre muet une personne avec plus de responsabilitées que toi la ? 😒",
                flags: MessageFlags.Ephemeral
            });
        }

        let timeoutDuration = null;
        if(duration) {
            timeoutDuration = parseDuration(duration);
            if(timeoutDuration === null) {
                return await interaction.reply({
                    content: "Ce format de durée est invalide. Utilisez plutôt quelque chose comme `1m`, `1h`... 😒",
                    flags: MessageFlags.Ephemeral
                });
            }
        }

        if (timeoutDuration) {
            try {
                await targetMember.timeout(timeoutDuration, `Mute par ${interaction.user.tag} : ${reason}`);
            } catch (error) {
                return await interaction.reply({
                    content: "Impossible d'appliquer le mute Discord (timeout). Vérifiez mes permissions.",
                    flags: MessageFlags.Ephemeral
                });
            }
        } else {
            // Si pas de durée, on applique le rôle mute classique
            const muteRoleId = process.env.MUTE_ROLE;
            const muteRole = interaction.guild.roles.cache.get(muteRoleId);
            if(!muteRole) {
                return await interaction.reply({
                    content: "Je n'arrives pas à trouver le rôle muet. 🙂‍↔️",
                    flags: MessageFlags.Ephemeral
                });
            }
            if(targetMember.roles.cache.has(muteRole)) {
                return await interaction.reply({
                    content: "Cet utilisateur est déjà muet, je pense qu'il a compris. 🙂‍↔️",
                    flags: MessageFlags.Ephemeral
                });
            }
            await targetMember.roles.add(muteRole, `Utilisateur rendu muet par ${interaction.user.tag} : ${reason}`);
        }

        const durationText = duration ? `pendant **${duration}**` : " **indéfiniment**";
        const confirmationMessage = `L'utilisateur **${targetUser.tag}** a été rendu muet ${durationText}.\nRaison : ${reason} 😒`;

        await interaction.reply({
            content: confirmationMessage
        });

        // DM à l'utilisateur lors du mute
        try {
            const dmMessage = `🔇 Vous avez été mute sur **${interaction.guild.name}**${durationText}.\n**Raison:** ${reason}`;
            await targetUser.send(dmMessage);
        } catch (error) {
            return;
        }
    }
};

function parseDuration(durationString) { // this function is requiered for a good format of the time.
    const regex = /^(\d+)([smhd])$/i;
    const match = durationString.match(regex);
    if (!match) return null;
    const value = parseInt(match[1]);
    const unit = match[2].toLowerCase();
    const multipliers = { // here we need to multiply the user input for set a good timer. Discord requires timestamp format.
        's': 1000,
        'm': 60 * 1000,
        'h': 60 * 60 * 1000,
        'd': 24 * 60 * 60 * 1000
    };
    return value * multipliers[unit]; // return the good format of the time.
}