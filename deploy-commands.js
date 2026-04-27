const { REST, Routes } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
require('dotenv').config();

const commands = [
    // Utility
    new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Affiche la latence du bot.'),

    // Modération
    new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bannit un membre du serveur.')
        .addUserOption(option =>
            option.setName('utilisateur')
                .setDescription('Le membre à bannir')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('raison')
                .setDescription('La raison du bannissement')),

    new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Expulse un membre du serveur.')
        .addUserOption(option =>
            option.setName('utilisateur')
                .setDescription('Le membre à expulser')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('raison')
                .setDescription('La raison de l\'expulsion')),

    new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Supprime un nombre de messages spécifié (max 100).')
        .addIntegerOption(option =>
            option.setName('nombre')
                .setDescription('Le nombre de messages à supprimer')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100)),

    new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Rend un membre muet (ne peut plus parler).')
        .addUserOption(option =>
            option.setName('utilisateur')
                .setDescription('Le membre à rendre muet')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('duree')
                .setDescription('Durée du mute en minutes (0 = permanent)')
                .setMinValue(0)),

    new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Permet à nouveau à un membre de parler.')
        .addUserOption(option =>
            option.setName('utilisateur')
                .setDescription('Le membre à démuter')
                .setRequired(true)),

    new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Donne un avertissement à un membre.')
        .addUserOption(option =>
            option.setName('utilisateur')
                .setDescription('Le membre à avertir')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('raison')
                .setDescription('La raison de l\'avertissement')
                .setRequired(true)),

    new SlashCommandBuilder()
        .setName('tempban')
        .setDescription('Bannit temporairement un membre.')
        .addUserOption(option =>
            option.setName('utilisateur')
                .setDescription('Le membre à bannir temporairement')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('duree')
                .setDescription('Durée du bannissement en minutes')
                .setRequired(true)
                .setMinValue(1))
        .addStringOption(option =>
            option.setName('raison')
                .setDescription('La raison du bannissement')),

    // YouTube Notifications
    new SlashCommandBuilder()
        .setName('addyoutube')
        .setDescription('Ajouter une chaîne YouTube à la surveillance.')
        .addStringOption(option =>
            option.setName('channel_id')
                .setDescription('L\'ID de la chaîne YouTube à surveiller')
                .setRequired(true))
        .addChannelOption(option =>
            option.setName('salon')
                .setDescription('Le salon où envoyer les notifications')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('Le rôle à ping lors d\'une nouvelle vidéo')),

    new SlashCommandBuilder()
        .setName('removeyoutube')
        .setDescription('Supprimer une chaîne YouTube de la surveillance.')
        .addStringOption(option =>
            option.setName('channel_id')
                .setDescription('L\'ID de la chaîne YouTube à retirer')
                .setRequired(true)),

    new SlashCommandBuilder()
        .setName('listyoutube')
        .setDescription('Lister toutes les chaînes YouTube surveillées.'),

    new SlashCommandBuilder()
        .setName('setyoutube')
        .setDescription('Modifier les paramètres d\'une chaîne YouTube surveillée.')
        .addStringOption(option =>
            option.setName('channel_id')
                .setDescription('L\'ID de la chaîne YouTube à modifier')
                .setRequired(true))
        .addChannelOption(option =>
            option.setName('salon')
                .setDescription('Le nouveau salon de notification'))
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('Le nouveau rôle à ping')),

    // Twitch Notifications
    new SlashCommandBuilder()
        .setName('addtwitch')
        .setDescription('Ajouter un streamer Twitch à la surveillance.')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('Le nom du streamer Twitch (sans le @)')
                .setRequired(true))
        .addChannelOption(option =>
            option.setName('salon')
                .setDescription('Le salon où envoyer les notifications')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('Le rôle à ping lors d\'un nouveau live')),

    new SlashCommandBuilder()
        .setName('removetwitch')
        .setDescription('Supprimer un streamer Twitch de la surveillance.')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('Le nom du streamer Twitch à retirer')
                .setRequired(true)),

    new SlashCommandBuilder()
        .setName('listtwitch')
        .setDescription('Lister tous les streamers Twitch surveillés.'),

    new SlashCommandBuilder()
        .setName('settwitch')
        .setDescription('Modifier les paramètres d\'un streamer Twitch surveillé.')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('Le nom du streamer Twitch à modifier')
                .setRequired(true))
        .addChannelOption(option =>
            option.setName('salon')
                .setDescription('Le nouveau salon de notification'))
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('Le nouveau rôle à ping')),

    // TikTok Notifications
    new SlashCommandBuilder()
        .setName('addtiktok')
        .setDescription('Ajouter un créateur TikTok à la surveillance.')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('Le nom du créateur TikTok (sans le @)')
                .setRequired(true))
        .addChannelOption(option =>
            option.setName('salon')
                .setDescription('Le salon où envoyer les notifications')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('Le rôle à ping lors d\'une nouvelle vidéo')),

    new SlashCommandBuilder()
        .setName('removetiktok')
        .setDescription('Supprimer un créateur TikTok de la surveillance.')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('Le nom du créateur TikTok à retirer')
                .setRequired(true)),

    new SlashCommandBuilder()
        .setName('listtiktok')
        .setDescription('Lister tous les créateurs TikTok surveillés.'),

    new SlashCommandBuilder()
        .setName('settiktok')
        .setDescription('Modifier les paramètres d\'un créateur TikTok surveillé.')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('Le nom du créateur TikTok à modifier')
                .setRequired(true))
        .addChannelOption(option =>
            option.setName('salon')
                .setDescription('Le nouveau salon de notification'))
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('Le nouveau rôle à ping')),

].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('Début du rafraîchissement des commandes (/) de l\'application.');

        const clientId = '1405194190715093014';
        const guildId = '1129497747364511795';

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log('Commandes (/) de l\'application rechargées avec succès.');
    } catch (error) {
        console.error(error);
    }
})();
