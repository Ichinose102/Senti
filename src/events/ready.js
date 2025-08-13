const { Events } = require('discord.js');
const { checkYouTube } = require('../components/youtubeNotifier');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client, config) {
        console.log(`✅ Prêt ! Connecté en tant que ${client.user.tag}`);
        
        // Démarrer la surveillance YouTube
        console.log('[YouTube] Démarrage de la surveillance...');
        checkYouTube(client, config);
        setInterval(() => checkYouTube(client, config), config.checkInterval);
    },
};