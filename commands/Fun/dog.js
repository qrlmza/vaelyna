const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const info = parseInt(process.env.INFO_COLOR);
const giphyApiKey = process.env.GIPHY_API_KEY;

async function getDogGif() {
    const res = await axios.get('https://api.giphy.com/v1/gifs/search', {
        params: {
            api_key: giphyApiKey,
            q: 'dog',
            limit: 10,
            rating: 'pg'
        }
    });
    const gifs = res.data.data;
    if (gifs.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * gifs.length);
    return gifs[randomIndex].images.original.url;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dog')
        .setDescription('Envoie un GIF de chien aléatoire !'),
    async execute(interaction) {
        try {
            const gifUrl = await getDogGif();
            if (!gifUrl) {
                return interaction.reply("Impossible de trouver un GIF de chien pour le moment.");
            }
            await interaction.reply({
                embeds: [{
                    color: info,
                    image: { url: gifUrl }
                }]
            });
        } catch (error) {
            await interaction.reply("Impossible de récupérer un GIF de chien pour le moment. Réessaie plus tard !");
        }
    }
};