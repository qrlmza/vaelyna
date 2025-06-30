const Discord = require('discord.js');
const db = require('../db');
require('dotenv').config();

const timer = true

const LEVEL_ROLES = {
    0: 'Niveau 0',
    10: 'Niveau 5',
    25: 'Niveau 10',
    37: 'Niveau 20',
    150: 'Niveau 40',
    320: 'Niveau 50',
    500: 'Niveau 70',
    1000: 'Niveau 100'
};

const BOOSTED_ROLES = [
    '🌹  • ㅤAmis',
    '💖  • ㅤServer Booster',
    '💐  • ㅤFemme de Selunik',
];

const levelSystem = (client) => {
    const cooldowns = new Map();

    client.on('messageCreate', async (message) => {
        if (message.author.bot) return;
        if (!message.guild) return;

        const colorSuccess = parseInt(process.env.SUCCESS_COLOR)
        const userId = message.author.id;
        const now = Date.now();

        if(timer === true) {
            if (cooldowns.has(userId)) {
                const expirationTime = cooldowns.get(userId) + 60000; // 1 minute
                if (now < expirationTime) {
                    return;
                }
            }

            cooldowns.set(userId, now);
        }

        try {
            const member = message.guild.members.cache.get(userId);
            const hasBoostRole = member.roles.cache.some(role => 
                BOOSTED_ROLES.includes(role.name)
            );

            const [rows] = await db.execute(
                'SELECT * FROM levels WHERE id = ?',
                [userId]
            );

            let userData = rows[0];
            let isNewUser = false;

            if (!userData) {
                await db.execute(
                    'INSERT INTO levels (id, exp, last_update, actual_level, boosted) VALUES (?, ?, ?, ?, ?)',
                    [userId, 0, new Date(), 0, hasBoostRole ? 1 : 0]
                );
                userData = {
                    id: userId,
                    exp: 0,
                    last_update: new Date(),
                    actual_level: 0,
                    boosted: hasBoostRole ? 1 : 0
                };
                isNewUser = true;
            }

            let expToAdd;
            if (hasBoostRole) {
                const minExp = 1.5;
                const maxExp = 4.5;
                expToAdd = Math.random() * (maxExp - minExp) + minExp;
            } else {
                const minExp = 0.8;
                const maxExp = 2.8;
                expToAdd = Math.random() * (maxExp - minExp) + minExp;
            }

            expToAdd = Math.round(expToAdd * 100) / 100;

            const currentExp = parseFloat(userData.exp) || 0;
            const newExp = currentExp + expToAdd;

            console.log(`\x1b[32m ⟭ [XP GAIN] User: ${message.author.username} (${userId}) | XP: +${expToAdd} | Boosted: ${hasBoostRole ? 'Yes' : 'No'} | Total XP: ${newExp.toFixed(2)}`);

            let newLevel = 0;
            const expThresholds = Object.keys(LEVEL_ROLES).map(Number).sort((a, b) => a - b);
            
            for (let threshold of expThresholds) {
                if (newExp >= threshold) {
                    newLevel = LEVEL_ROLES[threshold].split(' ')[1];
                }
            }

            const oldLevel = userData.actual_level;
            const leveledUp = newLevel > oldLevel;

            await db.execute(
                'UPDATE levels SET exp = ?, last_update = ?, actual_level = ?, boosted = ? WHERE id = ?',
                [newExp, new Date(), newLevel, hasBoostRole ? 1 : 0, userId]
            );

            if (leveledUp) {
                console.log(`\x1b[32m ⟭ [LEVEL UP] User: ${message.author.username} (${userId}) | Level: ${oldLevel} → ${newLevel}`);
            }

            if (leveledUp) {
                const roleThreshold = expThresholds.find(threshold => 
                    LEVEL_ROLES[threshold].split(' ')[1] == newLevel
                );
                
                if (roleThreshold) {
                    const roleName = LEVEL_ROLES[roleThreshold];
                    const role = message.guild.roles.cache.find(r => r.name === roleName);
                    
                    if (role) {
                        const oldRoles = member.roles.cache.filter(r => 
                            Object.values(LEVEL_ROLES).includes(r.name)
                        );
                        
                        if (oldRoles.size > 0) {
                            await member.roles.remove(oldRoles);
                        }
                        
                        await member.roles.add(role);
                        
                        const embed = new Discord.EmbedBuilder()
                            .setTitle('🎉 Niveau supérieur !')
                            .setDescription(`Félicitations ${message.author.username} ! Tu as atteint le **${roleName}** ! <:wechatsly:1379176909887377458>`)
                            .setColor(colorSuccess)
                            .addFields(
                                { name: '🍋 Expérience totale', value: `> \`${newExp.toFixed(2)}\` XP`, inline: true },
                                { name: '📈 Nouveau niveau', value: `> Level ${newLevel}`, inline: true }
                            )
                            .setThumbnail(message.author.displayAvatarURL())
                            .setTimestamp();

                        await message.channel.send({ embeds: [embed] });
                    }
                }
            }

        } catch (error) {
            console.error('\x1b[31m ⟭ An error has occured for the level system : ', error);
        }
    });
};

module.exports = levelSystem;