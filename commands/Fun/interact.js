const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const axios = require('axios');
const giphyApiKey = process.env.GIPHY_API_KEY;
const info = parseInt(process.env.INFO_COLOR)

const actionLabels = {
    hug: "fait un câlin",
    bite: "mord",
    hit: "frappe",
    caress: "caresse",
    Kiss: "embrasse"
};

async function getRandomGifGiphy(query) {
    const res = await axios.get('https://api.giphy.com/v1/gifs/search', {
        params: {
            api_key: giphyApiKey,
            q: query,
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
        .setName('interact')
        .setDescription(
            "Permet d'avoir une interaction avec un autre utilisateur."
        )
        .addUserOption(option =>
            option
                .setName("utilisateur")
                .setDescription("Utilisateur cible")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("interaction")
                .setDescription("Interaction souhaitée")
                .setRequired(true)
                .addChoices(
                    { name: "Calîn", value: "hug" },
                    { name: "Mordre", value: "bite" },
                    { name: "Frapper", value: "hit" },
                    { name: "Caresser", value: "caress" },
                    { name: "Embrasser", value: "Kiss" },
                )
        ),
    cooldown: 5,
    async execute(interaction) {

        const user = interaction.options.getUser('utilisateur');
        const action = interaction.options.getString('interaction');
        const actionFr = actionLabels[action] || action;

        const actionKeywords = {
            hug: 'anime hug',
            bite: 'anime bite',
            hit: 'anime slap',
            caress: 'anime pat',
            Kiss: 'anime kiss'
        };

        const keyword = actionKeywords[action] || 'anime';
        const gifUrl = await getRandomGifGiphy(keyword);

        if (!gifUrl) {
            return interaction.reply("Aucun GIF n'a été trouvé pour cette interaction. Veuillez essayer à nouveau.");
        }

        await interaction.reply({
            content: `${interaction.user} ${actionFr} ${user} !`,
            embeds: [{
                color: info,
                image: {
                    url: gifUrl
                }
            }]
        });
    },
};