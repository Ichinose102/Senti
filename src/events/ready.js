const { Events } = require('discord.js');
const { checkYouTube } = require('../components/youtubeNotifier');
const { checkTwitch } = require('../components/twitchNotifier');
const { checkTikTok } = require('../components/tiktokNotifier');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`✅ Prêt ! Connecté en tant que ${client.user.tag}`);

        // Démarrer la surveillance YouTube (toutes les 5 minutes)
        console.log('[YouTube] Démarrage de la surveillance...');
        checkYouTube(client);
        setInterval(() => checkYouTube(client), 300000);

        // Démarrer la surveillance Twitch (toutes les 2 minutes - plus fréquent pour les lives)
        console.log('[Twitch] Démarrage de la surveillance...');
        checkTwitch(client);
        setInterval(() => checkTwitch(client), 120000);

        // Démarrer la surveillance TikTok (toutes les 10 minutes)
        console.log('[TikTok] Démarrage de la surveillance...');
        checkTikTok(client);
        setInterval(() => checkTikTok(client), 600000);
    },
};
