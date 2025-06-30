const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const info = parseInt(process.env.INFO_COLOR);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('meme')
        .setDescription('Envoie un meme aléatoire !'),
    async execute(interaction) {
        try {
            const res = await axios.get('https://meme-api.com/gimme');
            const meme = res.data;
            await interaction.reply({
                embeds: [{
                    color: info,
                    title: meme.title,
                    image: { url: meme.url },
                    url: meme.postLink,
                    footer: { text: `👍 ${meme.ups} | r/${meme.subreddit}` }
                }]
            });
        } catch (error) {
            await interaction.reply("Impossible de récupérer un meme pour le moment. Réessaie plus tard !");
        }
    }
};