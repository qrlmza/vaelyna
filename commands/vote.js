const { SlashCommandBuilder, MessageFlags } = require('discord.js');

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
        let url = "";

        const choice = interaction.options.getString("site");

        if(choice = "disboard") {
            url = disboardUrl
        } else {
            url = serveurPriveUrl
        }

        const embed = new Discord.EmbedBuilder()
            .setColor(process.env.COLOR_INFO)
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
            .setThumbnail(guild.iconURL())
            .addFields(
                { name: "📡 Liens pour voter :", value: url }
            )
            .setTimestamp()
            .setFooter({ text: "Merci pour votre soutiens !", iconURL: interaction.user.displayAvatarURL() })
        
        interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });


    }
};