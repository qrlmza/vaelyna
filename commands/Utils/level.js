const { SlashCommandBuilder, MessageFlags, EmbedBuilder } = require('discord.js');
const db = require('../../db');
const color = parseInt(process.env.INFO_COLOR)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('level')
        .setDescription(
            "Admirer votre niveau actuel ou celui d'un utilisateur."
        )
        .addUserOption(option =>
            option
                .setName("utilisateur")
                .setDescription("Utilisateur cible")
                .setRequired(false)
        ),
    cooldown: 5,
    async execute(interaction) {

        try {
            const targetUser = interaction.options.getUser('utilisateur') || interaction.user;
            const targetId = targetUser.id;

            const [rows] = await db.execute(
                'SELECT * FROM levels WHERE id = ?',
                [targetId]
            );

            if (rows.length === 0) {
                const message = targetUser.id === interaction.user.id 
                    ? 'Tu n\'es pas encore enregistré dans le système de niveaux. Envoie quelques messages pour commencer !'
                    : `${targetUser.username} n'est pas encore enregistré dans le système de niveaux.`;
                
                return interaction.reply({ content: message, flags: MessageFlags.Ephemeral });
            }

            const userData = rows[0];
            const userExp = parseFloat(userData.exp) || 0;

            const [rankRows] = await db.execute(
                'SELECT COUNT(*) as rank FROM levels WHERE exp > ?',
                [userExp]
            );
            const rank = rankRows[0].rank + 1;

            const embed = new EmbedBuilder()
                .setTitle(`📊 Niveau de ${targetUser.username}`)
                .setColor(color)
                .addFields(
                    { name: 'Niveau actuel', value: `> Level ${userData.actual_level}`, inline: true },
                    { name: 'Expérience', value: `> \`${userExp.toFixed(2)}\` XP`, inline: true },
                    { name: 'Rang', value: `#${rank}`, inline: true },
                    { name: 'Boosté', value: userData.boosted ? ':white_check_mark: Oui' : ':x: Non', inline: true }
                )
                .setThumbnail(targetUser.displayAvatarURL())
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('\x1b[31m ⟭ An error has occured for the recuperation of the actual level', error);
            interaction.reply({ content: 'Une erreur est survenue lors de la récupération du niveau.', flags: MessageFlags.Ephemeral });
        }
    },
};