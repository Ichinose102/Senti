const { EmbedBuilder } = require('discord.js');
const RssParser = require('rss-parser');
const { loadYouTubeSubscriptions } = require('../utils/storage');

const parser = new RssParser();
const lastVideoIds = {}; // Stocke le dernier ID vidéo par chaîne

/**
 * Extrait l'ID d'une vidéo YouTube à partir de son URL.
 * @param {string} url L'URL de la vidéo.
 * @returns {string | null} L'ID de la vidéo ou null.
 */
function getVideoId(url) {
    const match = url.match(/(?:\?v=|\/embed\/|\/v\/|youtu\.be\/|\/watch\?v=)([^#\&\?]*).*/);
    return match && match[1];
}

async function checkYouTube(client) {
    const subscriptions = loadYouTubeSubscriptions();
    const channelsToCheck = Object.keys(subscriptions);

    if (channelsToCheck.length === 0) return;

    for (const channelId of channelsToCheck) {
        try {
            const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
            const feed = await parser.parseURL(feedUrl);

            if (!feed.items.length) continue;

            const latestVideo = feed.items[0];
            const videoId = getVideoId(latestVideo.link);

            if (!videoId) continue;

            // Initialisation
            if (!lastVideoIds[channelId]) {
                lastVideoIds[channelId] = videoId;
                console.log(`[YouTube] Initialisé : ${channelId} -> ${latestVideo.title}`);
                continue;
            }

            // Nouvelle vidéo détectée
            if (videoId !== lastVideoIds[channelId]) {
                lastVideoIds[channelId] = videoId;
                console.log(`[YouTube] Nouvelle vidéo : ${latestVideo.title}`);

                const sub = subscriptions[channelId];
                const channel = await client.channels.fetch(sub.channelId);

                if (!channel) {
                    console.error(`[YouTube] Salon ${sub.channelId} introuvable`);
                    continue;
                }

                // Création de l'embed
                const embed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle(latestVideo.title)
                    .setURL(latestVideo.link)
                    .setAuthor({
                        name: feed.title,
                        iconURL: 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png',
                        url: feed.link
                    })
                    .setDescription('🎬 Une nouvelle vidéo vient d\'être publiée !')
                    .setImage(`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`)
                    .setTimestamp(new Date(latestVideo.isoDate))
                    .setFooter({
                        text: 'Notification YouTube',
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
            console.error(`[YouTube] Erreur pour la chaîne ${channelId} :`, error.message);
        }
    }
}

module.exports = { checkYouTube };
