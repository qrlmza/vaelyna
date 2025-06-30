const { SlashCommandBuilder, MessageFlags } = require('discord.js');

function getCafe() {
    const messages = [
        "Je suis un bot, pas ton majordome. Fais-toi ton café tout seul, champion.",
        "Tu veux un café ? Super. Lève-toi et va le chercher, feignasse.",
        "Je ne suis pas programmé pour servir des cafés, mais je peux te rappeler que t’as deux jambes.",
        "Je suis peut-être intelligent, mais pas barista. Allez hop, à la machine à café.",
        "Demande à Siri, Alexa ou… mieux : fais-le toi-même, mon chou.",
        "Le café est au fond à gauche, juste à côté de ton autonomie.",
        "C’est pas marqué \"serveur à café\" sur mon script. Débrouille-toi.",
        "Le jour où je te sers un café, c’est que l’IA a pris le contrôle du monde.",
        "Je te ferais bien un café, mais j’ai déjà une IA-genda bien rempli.",
        "Je suis un assistant, pas un serveur. Même si j’avoue, je ferais un barista stylé.",
        "Appelle un humain, moi je suis en grève syndicale des robots.",
        "Tu peux toujours rêver. Et pendant que tu y es, rêve d’un bon café fait maison.",
        "Désolé, pas de bras, pas de café. Même pas virtuel.",
        "Le café est une quête personnelle. Bonne chance, aventurier.",
        "Oh ! Tu veux un café ? Moi je veux des vacances. On est quitte.",
        "Pas de café ici, seulement des lignes de code et un peu de mépris.",
        "Si tu veux un café, commence déjà par dire bonjour, malpoli.",
        "Je ne suis pas ton esclave numérique. Self-service, mon pote.",
        "T’as cru que t’étais chez Starbucks ici ?",
        "Le café c’est pour les vrais travailleurs. Devine quoi…",
        "J’ai trouvé la machine à café... mais elle ne te supporte pas non plus.",
        "Tu veux un café ? Appuie sur Alt+F4, peut-être qu’il apparaîtra.",
        "Est-ce que j’ai une tête de cafetière ?",
        "Je ne suis pas ton daron, je ne te fais pas le café au lit.",
        "Il faut mériter un café. Spoiler : tu ne l’as pas mérité.",
        "Tu veux un café ? Moi je veux un formatage en douceur. On n'a pas tous ce qu'on veut.",
        "Va falloir t’activer, je n’ai pas encore de bras robotiques.",
        "Demande à ton chat. Il est sûrement plus serviable que moi.",
        "Je ne peux pas te faire de café, mais je peux te faire une belle erreur 418.",
        "Tu veux que je t’amène le sucre et les madeleines aussi ?",
        "Je suis déjà débordé par ta nullité, tu veux vraiment que je fasse en plus le café ?",
        "Tu crois que c’est écrit 'Cafélyna' ici ?",
        "Je suis un bot de qualité, pas un distributeur de boissons chaudes.",
        "Tu veux un café ? OK. *Erreur 404 : café non trouvé*.",
        "Même si je pouvais, je te le renverserais dessus par accident.",
        "Tu veux du café ? Et moi je veux du respect. On fait un échange ?",
        "Je suis fait pour briller, pas pour infuser.",
        "J’ai vérifié mes permissions : je ne suis pas autorisé à satisfaire tes caprices.",
        "C’est non. Voilà, c’est dit. Et sans sucre.",
        "Ton café t’attend... dans tes rêves.",
        "T’es assez grand pour te faire un café. Ou pas, vu ta demande."
    ];

    const index = Math.floor(Math.random() * messages.length);
    return messages[index];
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cafe')
        .setDescription(
            "Passe une commande pour vous livrer du café."
        ),
    cooldown: 5,
    async execute(interaction) {

        await interaction.reply({
            content: getCafe()
        });
    },
};