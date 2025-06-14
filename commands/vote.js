const { SlashCommandBuilder, MessageFlags, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vote')
        .setDescription('🔎 → Voter pour le serveur afin de nous aider')
        .addStringOption(option =>
            option
                .setName("site")
                .setDescription("Choisissez le site où vous souhaitez voter")
                .setRequired(true)
                .addChoices(
                    { name: "Disboard", value: "disboard" },
                    { name: "Serveur-privé.net", value: "serveurprive" }
                )
        ),

    async execute(interaction) {
        const disboardUrl = process.env.URL1;
        const serveurPriveUrl = process.env.URL2;
        
        const choice = interaction.options.getString("site");
        const url = choice === "disboard" ? disboardUrl : serveurPriveUrl;
        const siteName = choice === "disboard" ? "Disboard" : "Serveur-privé.net";

        const embed = new EmbedBuilder()
            .setColor(process.env.COLOR_INFO)
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
            .setThumbnail(interaction.guild.iconURL())
            .addFields(
                { name: "📡 Lien pour voter :", value: `[Cliquez ici pour voter sur ${siteName}](${url})` }
            )
            .setTimestamp()
            .setFooter({ text: "Merci pour votre soutien !", iconURL: interaction.guild.iconURL() })
        
        await interaction.reply({ 
            embeds: [embed], 
            flags: MessageFlags.Ephemeral,
            components: [{
                type: 1,
                components: [{
                    type: 2,
                    style: 5,
                    label: `Voter sur ${siteName}`,
                    url: url,
                    emoji: '🗳️'
                }]
            }]
        });
    }
};