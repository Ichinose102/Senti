const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Affiche la latence du bot.'),
    async execute(interaction) {
        // Le bot répond d'abord, ce qui nous permet de mesurer le temps de réponse
        const sent = await interaction.reply({ content: 'Calcul en cours...', fetchReply: true });
        
        // Calcule la latence de l'API et la latence du bot
        const roundtripLatency = sent.createdTimestamp - interaction.createdTimestamp;
        const websocketHeartbeat = interaction.client.ws.ping;

        // Modifie la réponse originale pour afficher les résultats
        await interaction.editReply(`🏓 Pong !\nLatence du WebSocket : **${websocketHeartbeat}ms**\nLatence de l'API (Roundtrip) : **${roundtripLatency}ms**`);
    },
};