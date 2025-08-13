const RssParser = require('rss-parser');
const parser = new RssParser();
let lastVideoId = '';

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

            const channel = await client.channels.fetch(config.notificationChannelId);
            if (channel) {
                const message = `🚨 **NOUVELLE VIDÉO !** 🚨\n\n**${feed.title}** a publié : **${latestVideo.title}**\n${latestVideo.link}`;
                channel.send(message);
            }
        }
    } catch (error) {
        console.error('[YouTube] Erreur lors de la vérification :', error);
    }
}

module.exports = { checkYouTube };