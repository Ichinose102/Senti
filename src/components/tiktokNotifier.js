const { EmbedBuilder } = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');
const { loadTikTokSubscriptions } = require('../utils/storage');

const lastVideoIds = {}; // Stocke le dernier ID vidéo par utilisateur

/**
 * Récupère les dernières vidéos d'un utilisateur TikTok via web scraping
 */
async function getTikTokVideos(username) {
    try {
        const url = `https://www.tiktok.com/@${username}`;
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9',
            },
            timeout: 10000
        });

        const $ = cheerio.load(response.data);
        const videos = [];

        // Extraire les données JSON des vidéos depuis le script SIGI_STATE
        $('script').each((i, el) => {
            const content = $(el).html();
            if (content && content.includes('SIGI_STATE')) {
                try {
                    const match = content.match(/SIGI_STATE\s*=\s*({.+?});/);
                    if (match) {
                        const data = JSON.parse(match[1]);
                        if (data.ItemModule) {
                            Object.values(data.ItemModule).forEach(video => {
                                videos.push({
                                    id: video.id,
                                    title: video.desc || 'Nouvelle vidéo TikTok',
                                    createTime: video.createTime,
                                    link: `https://www.tiktok.com/@${username}/video/${video.id}`
                                });
                            });
                        }
                    }
                } catch (e) {
                    // Continue si le parsing échoue
                }
            }
        });

        // Trier par date (plus récent en premier)
        videos.sort((a, b) => b.createTime - a.createTime);

        return videos.slice(0, 5); // Retourne les 5 dernières vidéos
    } catch (error) {
        if (error.code !== 'ECONNABORTED' && error.response?.status !== 404) {
            console.error(`[TikTok] Erreur pour ${username}:`, error.message);
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
            const videoId = latestVideo.id;

            // Initialisation
            if (!lastVideoIds[username]) {
                lastVideoIds[username] = videoId;
                console.log(`[TikTok] Initialisé : @${username} -> ${latestVideo.title.substring(0, 30)}...`);
                continue;
            }

            // Nouvelle vidéo détectée
            if (videoId !== lastVideoIds[username]) {
                lastVideoIds[username] = videoId;
                console.log(`[TikTok] Nouvelle vidéo : @${username} -> ${latestVideo.title.substring(0, 30)}...`);

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
                    .setTimestamp(new Date(latestVideo.createTime * 1000))
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
