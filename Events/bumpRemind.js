const { Events } = require('discord.js');
const bumpNotifRole = process.env.BUMP_NOTIF_ROLE

module.exports = (client) => {
    client.on(Events.MessageCreate, async (message) => {
        if (message.author.id !== '302050872383242240') return;

        message.channel.send("🍋 Bump enregistré ! Vous serrez notifié dans 2 heures pour le prochain bump.");

        if (
            message.embeds.length > 0 &&
            message.embeds[0].description &&
            message.embeds[0].description.includes('Bump effectué !')
        ) {
            console.log("\x1b[32m ⟭ Bump detected, stating timer for reminder.");
            setTimeout(() => {
                message.channel.send({
                    content: `🔔 <@&${bumpNotifRole}> Il est temps de refaire un </bump:947088344167366698> !`
                });
            }, 2 * 60 * 60 * 1000); // 2 heures
        } else {
            console.log("\x1b[31m ⟭ An error occurred during the detection of a bump.");
        }
    });
};