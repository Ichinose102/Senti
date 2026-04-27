const { EmbedBuilder } = require('discord.js');
const { loadTikTokSubscriptions } = require('../utils/storage');

const lastVideoIds = {}; // Stocke le dernier ID vidéo par utilisateur

/**
 * Récupère les dernières vidéos d'un utilisateur TikTok
 * Note: TikTok n'a pas d'API publique officielle pour les vidéos
 * Cette implémentation utilise rss.app comme service tiers
 */
async function getTikTokVideos(username) {
    const RssParser = require('rss-parser');
    const parser = new RssParser();

    // rss.app nécessite une clé API pour fonctionner correctement
    // Inscrivez-vous sur https://rss.app pour obtenir votre clé
    const RSS_APP_API_KEY = process.env.RSS_APP_API_KEY || '';

    if (!RSS_APP_API_KEY) {
        console.log('[TikTok] RSS_APP_API_KEY manquante. Les notifications TikTok sont désactivées.');
        return [];
    }

    // URL du flux RSS via rss.app
    const feedUrl = `https://rss.app/app/feed/${RSS_APP_API_KEY}/tiktok/${username}.xml`;

    try {
        const feed = await parser.parseURL(feedUrl);
        return feed.items || [];
    } catch (error) {
        if (error.code !== 'ENOTFOUND') {
            console.error(`[TikTok] Erreur RSS pour ${username}:`, error.message);
        }
        return [];
    }
}

async function checkTikTok(client) {
    const subscriptions = loadTikTokSubscriptions();
    const usersToCheck = Object.keys(subscriptions);

    if (usersToCheck.length === 0) return;

    for (const username of usersToCheck) {
        try {
            const sub = subscriptions[username];
            const videos = await getTikTokVideos(username);

            if (!videos.length) continue;

            const latestVideo = videos[0];

            // Extraction de l'ID vidéo depuis l'URL
            const videoMatch = latestVideo.link?.match(/\/video\/(\d+)/);
            const videoId = videoMatch ? videoMatch[1] : null;

            if (!videoId) continue;

            // Initialisation
            if (!lastVideoIds[username]) {
                lastVideoIds[username] = videoId;
                console.log(`[TikTok] Initialisé : @${username}`);
                continue;
            }

            // Nouvelle vidéo détectée
            if (videoId !== lastVideoIds[username]) {
                lastVideoIds[username] = videoId;
                console.log(`[TikTok] Nouvelle vidéo : @${username}`);

                const channel = await client.channels.fetch(sub.channelId);
                if (!channel) {
                    console.error(`[TikTok] Salon ${sub.channelId} introuvable`);
                    continue;
                }

                // Création de l'embed
                const embed = new EmbedBuilder()
                    .setColor('#00f2ea')
                    .setTitle(`🎵 Nouvelle vidéo TikTok`)
                    .setURL(latestVideo.link)
                    .setAuthor({
                        name: `@${username}`,
                        iconURL: 'https://cdn-icons-png.flaticon.com/512/3046/3046121.png',
                        url: `https://tiktok.com/@${username}`
                    })
                    .setDescription(latestVideo.title || 'Une nouvelle vidéo vient d\'être publiée !')
                    .setTimestamp()
                    .setFooter({
                        text: 'Notification TikTok',
                        iconURL: client.user.displayAvatarURL()
                    });

                // Message avec ping du rôle si configuré
                const content = sub.roleId ? `<@&${sub.roleId}>` : null;

                await channel.send({
                    content: content,
                    embeds: [embed]
                });
            }
        } catch (error) {
            console.error(`[TikTok] Erreur pour ${username} :`, error.message);
        }
    }
}

module.exports = { checkTikTok };
