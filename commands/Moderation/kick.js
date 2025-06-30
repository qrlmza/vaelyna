const { SlashCommandBuilder, MessageFlags, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const db = require('../../db');
const red = parseInt(process.env.ERROR_COLOR)
const staffRoleId = process.env.STAFF_ROLE

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription(
            "[STAFF] Permet aux modérateur d'expulser un membre du serveur."
        )
        .addUserOption(option =>
            option
                .setName("utilisateur")
                .setDescription("Utilisateur cible")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("raison")
                .setDescription("Raison de la sanction")
                .setRequired(true)
        ),
    cooldown: 5,
    async execute(interaction) {

        const user = interaction.options.getUser("utilisateur");
        const member = interaction.options.getMember("utilisateur");
        const reason = interaction.options.getString("raison");
        const author = interaction.user;
        const now = new Date();

        if(!interaction.member.roles.cache.has(staffRoleId)) {
            return interaction.reply({
                content: "Mh, Tu n'as pas la permission de faire ce genre de choses.",
                flags: MessageFlags.Ephemeral
            });
        }

        if(!user || !member) {
            return interaction.reply({
                content: "Je crain qu'il y ai un quiproquo car je ne trouve pas l'utilisateur visé...",
                flags: MessageFlags.Ephemeral
            });
        }

        try {
            try {
                const appealButton = new ButtonBuilder()
                    .setLabel('Faire appel à la sanction')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://lunik-commu.whst.fr/appeals')
                    .setEmoji('⚖️');

                const joinButton = new ButtonBuilder()
                    .setLabel('Rejoindre le serveur')
                    .setStyle(ButtonStyle.Link)
                    .setURL(process.env.SERVER_INVITE)
                    .setEmoji('🙋');

                const row = new ActionRowBuilder()
                    .addComponents(appealButton, joinButton);

                await user.send({
                    embeds: [{
                        color: red,
                        title: `🚨 Vous avez été expulsé du serveur ${interaction.guild.name}`,
                        description: `Vous avez été expulsé du serveur par ${author}.`,
                        fields: [
                            { name: "Raison :", value: `\`\`\`${reason}\`\`\``, inline: false },
                            { name: "Date :", value: `<t:${Math.floor(now.getTime() / 1000)}:F>`, inline: false }
                        ],
                        footer: {
                            text: `Serveur : ${interaction.guild.name} • ID : ${user.id}`,
                            iconURL: interaction.guild.iconURL()
                        }
                    }],
                    components: [row]
                });
            } catch (dmError) {
                console.log(`\x1b[31m ⟭ Unable to send DM to ${user.tag}: ${dmError.message}`);
            }

            await member.kick(reason);
            
            await db.execute(
                'INSERT INTO sanctions (user, author, reason, date, type, canceled) VALUES (?, ?, ?, ?, ?, ?)',
                [user.id, author.id, reason, now, "kick", false]
            );

            await interaction.reply({
                embeds: [{
                    color: red,
                    title: `👮‍♂️ Un utilisateur a été expulsé !`,
                    url: "https://lunik-commu.whst.fr/appeals",
                    description: `> ${user} à été expulsé par ${author}`,
                    thumbnail: {
                        url: user.displayAvatarURL()
                    },
                    fields: [
                        { name: "Raison : ", value: `\`\`\`${reason}\`\`\``, inline: false },
                        { name: "Date : ", value: `<t:${Math.floor(now.getTime() / 1000)}:F>`, inline: false },
                    ],
                    footer: {
                        text: `ID : ${user.id}`,
                        iconURL: interaction.guild.iconURL()
                    }
                }]
            });

        } catch (error) {
            console.error("\x1b[31m ⟭ An error has occurred when trying to kick the user : ", error);
            
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: "Bon, il y a une erreur qui est survenue lors de l'expulsion du membre...",
                    flags: MessageFlags.Ephemeral
                });
            } else {
                await interaction.followUp({
                    content: "Bon, il y a une erreur qui est survenue lors de l'expulsion du membre...",
                    flags: MessageFlags.Ephemeral
                });
            }
        }
    },
};