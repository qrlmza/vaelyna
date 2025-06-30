const Discord = require('discord.js');
require('dotenv').config();

const {
    MEMBER_ROLE: memberRoleId,
    BASICS_ROLE: basicsRoleId,
    BOOST_ROLE: boostRoleId,
    LEVELS_ROLE: levelsRoleId,
    NOTIFS_ROLE: notifsRoleId,
    COLOR_ROLE: colorRoleId,
    DEFAULT_LEVEL_ROLE: levelZeroRoleId,
    GENERAL_CHANNEL: welcomeChannel,
    INFO_COLOR: infoColor,
} = process.env;

const Roles = [
    memberRoleId,
    basicsRoleId,
    boostRoleId,
    levelsRoleId,
    notifsRoleId,
    colorRoleId,
    levelZeroRoleId,
];

const guildUserAdd = (client) => {

    client.on("guildMemberAdd", async (member) => {

        await Promise.all([
            member.roles.add(Roles),
        ]);

        const avatarURL = member.user.displayAvatarURL({ format: 'png', size: 128 });
        const username = member.user.username;
        const memberCount = member.guild.memberCount;
        const channel = member.guild.channels.cache.get(welcomeChannel);
        const color = parseInt(infoColor);
        
        // Récupération de l'icône du serveur avec gestion des cas null
        const guildIconURL = member.guild.iconURL({ format: 'png', size: 64 });
        
        // Debug : afficher l'URL de l'icône
        console.log(`\x1b[33m ⟭ URL de l'icône du serveur: ${guildIconURL}`);
        console.log(`\x1b[33m ⟭ Nom du serveur: ${member.guild.name}`);
        
        // Créer l'embed
        const embed = {
            color: color,
            author: {
                name: username,
                icon_url: avatarURL
            },
            title: `<:Pinkflower:1379030319071625247> Bienvenue sur le serveur !`,
            description: `- Pense à lire nos règles : <#1378581312172068976>\n- Tu peux te présenter dans le salon <#1378583912606863370>.\n- Si tu as des questions, un problème, n'hésite pas à te rendre dans le salon <#1378581147419807765>.`,
            timestamp: new Date().toISOString(),
            image: {
                url: "https://i.pinimg.com/originals/b3/4b/d0/b34bd0ef85660338e6082332e0d31a7f.gif"
            },
            footer: {
                text: `Nous sommes désormais ${memberCount} sur le serveur.`
            }
        };

        // Ajouter l'icône du footer seulement si elle existe
        if (guildIconURL) {
            embed.footer.icon_url = guildIconURL;
            console.log(`\x1b[32m ⟭ Icône du serveur ajoutée au footer`);
        } else {
            console.log(`\x1b[31m ⟭ Aucune icône de serveur trouvée`);
        }
        
        channel.send({
            content: `${member.user}`,
            embeds: [embed]
        });

        console.log(
            `\x1b[34m ⟭ Les rôles ont été ajoutés à l'utilisateur ${member.user.tag} à son arrivée sur le serveur.`
        );

        console.log(
            `\x1b[34m ⟭ Le message de bienvenue à également bien été envoyé.`
        );
    });
}

module.exports = guildUserAdd;