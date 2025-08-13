// deploy-commands.js
const { REST, Routes } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
require('dotenv').config();

const commands = [
    new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Répond avec Pong!'),
    new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Supprime un nombre de messages spécifié.')
        .addIntegerOption(option => 
            option.setName('nombre')
                .setDescription('Le nombre de messages à supprimer (entre 1 et 100)')
                .setRequired(true)),
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
        .setName('ban')
        .setDescription('Bannit un membre du serveur.')
        .addUserOption(option => 
            option.setName('utilisateur')
                .setDescription('Le membre à bannir')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('raison')
                .setDescription('La raison du bannissement')),
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('Début du rafraîchissement des commandes (/) de l\'application.');

        // ⬇️ REMPLACEZ CES VALEURS ⬇️
        const clientId = 'VOTRE_ID_CLIENT_APPLICATION';
        const guildId = 'VOTRE_ID_DE_SERVEUR'; 
        // ⬆️ REMPLACEZ CES VALEURS ⬆️

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log('Commandes (/) de l\'application rechargées avec succès.');
    } catch (error) {
        console.error(error);
    }
})();