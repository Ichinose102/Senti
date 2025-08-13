const { EmbedBuilder } = require('discord.js');
const RssParser = require('rss-parser');
const parser = new RssParser();
let lastVideoId = '';

/**
 * Extrait l'ID d'une vidéo YouTube à partir de son URL.
 * @param {string} url L'URL de la vidéo.
 * @returns {string | null} L'ID de la vidéo ou null.
 */
function getVideoId(url) {
    const match = url.match(/(?:\?v=|\/embed\/|\/v\/|youtu\.be\/|\/watch\?v=)([^#\&\?]*).*/);
    return match && match[1];
}

async function checkYouTube(client, config) {
    try {
        const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${config.youtubeChannelId}`;
        const feed = await parser.parseURL(feedUrl);
        
        if (!feed.items.length) return;
        const latestVideo = feed.items[0];

        if (!lastVideoId) {
            lastVideoId = latestVideo.id;
            console.log(`[YouTube] Initialisation terminée. Dernière vidéo : ${latestVideo.title}`);
            return;
        }

        if (latestVideo.id !== lastVideoId) {
            console.log(`[YouTube] Nouvelle vidéo détectée : ${latestVideo.title}`);
            lastVideoId = latestVideo.id;
            
            const videoId = getVideoId(latestVideo.link);
            if (!videoId) return; // Impossible de trouver l'ID, on arrête

            // Création de l'embed
            const newVideoEmbed = new EmbedBuilder()
                .setColor('#FF0000') // La couleur rouge de YouTube
                .setTitle(latestVideo.title)
                .setURL(latestVideo.link)
                .setAuthor({ 
                    name: feed.title, // Nom de la chaîne YouTube
                    iconURL: 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png', // Icône YouTube générique
                    url: feed.link // Lien vers la chaîne
                })
                .setDescription("Une nouvelle vidéo vient d'être publiée !")
                .setImage(`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`) // Miniature de la vidéo
                .setTimestamp(new Date(latestVideo.isoDate)) // Date de publication
                .setFooter({ text: 'Notification YouTube', iconURL: client.user.displayAvatarURL() });

            // Envoi de l'embed dans le salon configuré
            const channel = await client.channels.fetch(config.notificationChannelId);
            if (channel) {
                // On peut aussi ajouter un message texte si on veut pouvoir notifier des rôles
                channel.send({ embeds: [newVideoEmbed] });
            }
        }
    } catch (error) {
        console.error('[YouTube] Erreur lors de la vérification :', error);
    }
}

module.exports = { checkYouTube };