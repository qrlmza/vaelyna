const { Collection, REST, Routes, MessageFlags, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');

const commandsHandler = (client) => {
    client.commands = new Collection();
    client.cooldowns = new Collection();

    const loadCommands = () => {
        const commandsPath = path.join(process.cwd(), 'commands');
        
        if (!fs.existsSync(commandsPath)) {
            console.log('\x1b[33m ⟭ Commands directory not found. Creating one...');
            fs.mkdirSync(commandsPath, { recursive: true });
            return [];
        }

        const commands = [];
        
        const loadCommandsFromDirectory = (directory) => {
            const items = fs.readdirSync(directory, { withFileTypes: true });
            
            for (const item of items) {
                const itemPath = path.join(directory, item.name);
                
                if (item.isDirectory()) {
                    loadCommandsFromDirectory(itemPath);
                } else if (item.isFile() && item.name.endsWith('.js')) {
                    try {
                        delete require.cache[require.resolve(itemPath)];
                        const command = require(itemPath);

                        if ('data' in command && 'execute' in command) {
                            client.commands.set(command.data.name, command);
                            commands.push(command.data.toJSON());
                            
                            const relativePath = path.relative(commandsPath, itemPath);
                            console.log(`\x1b[32m ⟭ Loaded command: ${command.data.name} (${relativePath})`);
                        } else {
                            console.log(`\x1b[31m ⟭ Command at ${itemPath} is missing required "data" or "execute" property.`);
                        }
                    } catch (error) {
                        console.error(`\x1b[31m ⟭ Error loading command ${item.name}:`, error);
                    }
                }
            }
        };

        loadCommandsFromDirectory(commandsPath);
        return commands;
    };

    const deployCommands = async (commands) => {
        if (commands.length === 0) {
            console.log('\x1b[33m ⟭ No commands to deploy.');
            return;
        }

        try {
            const rest = new REST().setToken(process.env.TOKEN);
            
            console.log(`\x1b[36m ⟭ Started refreshing ${commands.length} application (/) commands.`);

            const route = process.env.GUILD_ID 
                ? Routes.applicationGuildCommands(client.user.id, process.env.GUILD_ID)
                : Routes.applicationCommands(client.user.id);

            const data = await rest.put(route, { body: commands });

            console.log(`\x1b[32m ⟭ Successfully reloaded ${data.length} application (/) commands.`);
        } catch (error) {
            console.error('\x1b[31m ⟭ Error deploying commands:', error);
        }
    };

    const handleInteraction = async (interaction) => {
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) {
                console.error(`\x1b[31m ⟭ No command matching ${interaction.commandName} was found.`);
                return;
            }

            const { cooldowns } = client;
            if (!cooldowns.has(command.data.name)) {
                cooldowns.set(command.data.name, new Collection());
            }

            const now = Date.now();
            const timestamps = cooldowns.get(command.data.name);
            const defaultCooldownDuration = 3;
            const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;

            if (timestamps.has(interaction.user.id)) {
                const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

                if (now < expirationTime) {
                    const expiredTimestamp = Math.round(expirationTime / 1000);
                    return interaction.reply({
                        embeds: [{
                            color: parseInt(process.env.WARN_COLOR),
                            description: `${process.env.TIMER} Veuillez patienter, vous êtes en délai d'attente pour \`${command.data.name}\`. Vous pourrez l'utiliser à nouveau <t:${expiredTimestamp}:R>.`
                        }],
                        flags: MessageFlags.Ephemeral
                    });
                }
            }

            timestamps.set(interaction.user.id, now);
            setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

            try {
                await command.execute(interaction);
                console.log(`\x1b[34m ⟭ ${interaction.user.tag} executed /${command.data.name}`);
            } catch (error) {
                console.error(`\x1b[31m ⟭ Error executing command ${command.data.name}:`, error);
                const errorMessage = {
                    embeds: [{
                        color: parseInt(process.env.ERROR_COLOR),
                        description: `${process.env.CROSS} Une erreur s'est produite lors de l'exécution de cette commande !`
                    }],
                    flags: MessageFlags.Ephemeral
                };
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp(errorMessage);
                } else {
                    await interaction.reply(errorMessage);
                }
            }
        }
        // Gestion du menu déroulant pour unban
        else if (interaction.isStringSelectMenu() && interaction.customId === 'unban_select') {
            const userId = interaction.values[0];
            
            try {
                // Récupérer les informations de l'utilisateur banni
                const bans = await interaction.guild.bans.fetch();
                const bannedUser = bans.get(userId);
                
                if (!bannedUser) {
                    return interaction.reply({
                        content: "Cet utilisateur n'est plus banni du serveur.",
                        flags: MessageFlags.Ephemeral
                    });
                }

                // Récupérer la raison de l'interaction originale (stockée temporairement)
                const originalReason = interaction.message.embeds[0]?.footer?.text?.includes('Raison:') 
                    ? interaction.message.embeds[0].footer.text.split('Raison: ')[1] 
                    : '';

                // Créer un modal pour confirmer le débannissement
                const modal = new ModalBuilder()
                    .setCustomId(`unban_modal_${userId}`)
                    .setTitle('Confirmation de débannissement');

                const reasonInput = new TextInputBuilder()
                    .setCustomId('unban_reason')
                    .setLabel('Raison du débannissement')
                    .setStyle(TextInputStyle.Paragraph)
                    .setValue(originalReason)
                    .setPlaceholder('Raison du débannissement...')
                    .setRequired(true)
                    .setMaxLength(1000);

                const firstActionRow = new ActionRowBuilder().addComponents(reasonInput);
                modal.addComponents(firstActionRow);

                await interaction.showModal(modal);

            } catch (error) {
                console.error("\x1b[31m ⟭ Erreur lors de la sélection pour unban : ", error);
                return interaction.reply({
                    content: "Une erreur est survenue lors de la sélection de l'utilisateur.",
                    flags: MessageFlags.Ephemeral
                });
            }
        }
        // Gestion du modal de débannissement
        else if (interaction.isModalSubmit() && interaction.customId.startsWith('unban_modal_')) {
            const userId = interaction.customId.split('_')[2];
            const reason = interaction.fields.getTextInputValue('unban_reason');
            const author = interaction.user;
            const now = new Date();
            const green = parseInt(process.env.SUCCESS_COLOR);
            const db = require('../db');
            const staffRoleId = process.env.STAFF_ROLE;

            // Vérifier les permissions
            if(!interaction.member.roles.cache.has(staffRoleId)) {
                return interaction.reply({
                    content: "Mh, Tu n'as pas la permission de faire ce genre de choses.",
                    flags: MessageFlags.Ephemeral
                });
            }

            try {
                // Vérifier que l'utilisateur est encore banni
                const bans = await interaction.guild.bans.fetch();
                const bannedUser = bans.get(userId);
                
                if (!bannedUser) {
                    return interaction.reply({
                        content: "Cet utilisateur n'est plus banni du serveur.",
                        flags: MessageFlags.Ephemeral
                    });
                }

                const user = bannedUser.user;

                // Débannir l'utilisateur
                await interaction.guild.members.unban(userId, reason);
                
                // Mettre à jour la base de données
                await db.execute(
                    'UPDATE sanctions SET canceled = ?, cancel_date = ? WHERE user = ? AND type = ? AND canceled = ? ORDER BY date DESC LIMIT 1',
                    [true, now, userId, "ban", false]
                );

                // Essayer d'envoyer un MP à l'utilisateur
                try {
                    const joinButton = new ButtonBuilder()
                        .setLabel('Rejoindre le serveur')
                        .setStyle(ButtonStyle.Link)
                        .setURL(process.env.SERVER_INVITE)
                        .setEmoji('🙋');

                    const row = new ActionRowBuilder()
                        .addComponents(joinButton);

                    await user.send({
                        embeds: [{
                            color: green,
                            title: `✅ Vous avez été débanni du serveur ${interaction.guild.name}`,
                            description: `Votre bannissement a été révoqué par ${author}.`,
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

                // Répondre avec un embed de confirmation
                await interaction.reply({
                    embeds: [{
                        color: green,
                        title: `✅ Un utilisateur a été débanni !`,
                        description: `> ${user} à été débanni par ${author}`,
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
                    }],
                    flags: MessageFlags.Ephemeral
                });

                console.log(`\x1b[32m ⟭ ${author.tag} unbanned ${user.tag} (${user.id}) - Reason: ${reason}`);

            } catch (error) {
                console.error("\x1b[31m ⟭ Erreur lors du débannissement : ", error);
                
                if (!interaction.replied && !interaction.deferred) {
                    await interaction.reply({
                        content: "Bon, il y a une erreur qui est survenue lors du débannissement du membre...",
                        flags: MessageFlags.Ephemeral
                    });
                } else {
                    await interaction.followUp({
                        content: "Bon, il y a une erreur qui est survenue lors du débannissement du membre...",
                        flags: MessageFlags.Ephemeral
                    });
                }
            }
        }
        // Gestion du menu déroulant pour help (existant)
        else if (interaction.isStringSelectMenu() && interaction.customId === 'help-category-select') {
            return;
        }
    };

    client.reloadCommands = async () => {
        console.log('\x1b[36m ⟭ Reloading commands...');
        client.commands.clear();
        const commands = loadCommands();
        await deployCommands(commands);
    };

    client.once('ready', async () => {
        const commands = loadCommands();
        await deployCommands(commands);
        client.commandIdMap = {};
        const globalCommands = await client.application.commands.fetch();
        globalCommands.forEach(cmd => {
            client.commandIdMap[cmd.name] = cmd.id;
        });
        if (process.env.GUILD_ID) {
            const guild = await client.guilds.fetch(process.env.GUILD_ID).catch(() => null);
            if (guild) {
                const guildCommands = await guild.commands.fetch();
                guildCommands.forEach(cmd => {
                    client.commandIdMap[cmd.name] = cmd.id;
                });
            }
        }
    });

    client.on('interactionCreate', handleInteraction);

    process.on('unhandledRejection', error => {
        console.error('\x1b[31m ⟭ Unhandled promise rejection:', error);
    });
};

module.exports = commandsHandler;