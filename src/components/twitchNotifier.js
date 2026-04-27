const { EmbedBuilder } = require('discord.js');
const { loadTwitchSubscriptions } = require('../utils/storage');

const CLIENT_ID = process.env.TWITCH_CLIENT_ID || '';
const ACCESS_TOKEN = process.env.TWITCH_ACCESS_TOKEN || '';

const lastStreamIds = {}; // Stocke le dernier stream ID par chaîne

/**
 * Récupère les infos d'un streamer Twitch via l'API
 */
async function getTwitchUserInfo(username) {
    const response = await fetch(`https://api.twitch.tv/helix/users?login=${username}`, {
        headers: {
            'Client-ID': CLIENT_ID,
            'Authorization': `Bearer ${ACCESS_TOKEN}`
        }
    });
    const data = await response.json();
    return data.data?.[0] || null;
}

/**
 * Récupère le stream actuel d'un channel
 */
async function getStreamInfo(userId) {
    const response = await fetch(`https://api.twitch.tv/helix/streams?user_id=${userId}`, {
        headers: {
            'Client-ID': CLIENT_ID,
            'Authorization': `Bearer ${ACCESS_TOKEN}`
        }
    });
    const data = await response.json();
    return data.data?.[0] || null;
}

async function checkTwitch(client) {
    const subscriptions = loadTwitchSubscriptions();
    const channelsToCheck = Object.keys(subscriptions);

    if (channelsToCheck.length === 0) return;

    for (const username of channelsToCheck) {
        try {
            const sub = subscriptions[username];
            const userInfo = await getTwitchUserInfo(username);

            if (!userInfo) {
                console.error(`[Twitch] Channel introuvable : ${username}`);
                continue;
            }

            const stream = await getStreamInfo(userInfo.id);

            // Le streamer est en live
            if (stream) {
                // Vérifier si c'est un nouveau stream (même ID = même stream)
                if (lastStreamIds[username] === stream.id) {
                    continue; // Déjà notifié pour ce stream
                }

                lastStreamIds[username] = stream.id;
                console.log(`[Twitch] Live détecté : ${username} -> ${stream.title}`);

                const channel = await client.channels.fetch(sub.channelId);
                if (!channel) {
                    console.error(`[Twitch] Salon ${sub.channelId} introuvable`);
                    continue;
                }

                // Création de l'embed
                const embed = new EmbedBuilder()
                    .setColor('#9146FF')
                    .setTitle(`🔴 ${stream.title}`)
                    .setURL(`https://twitch.tv/${username}`)
                    .setAuthor({
                        name: userInfo.display_name,
                        iconURL: userInfo.profile_image_url,
                        url: `https://twitch.tv/${username}`
                    })
                    .setDescription('🎮 Est en direct maintenant !')
                    .setThumbnail(userInfo.profile_image_url)
                    .addFields(
                        { name: '📺 Jeu', value: stream.game_name || 'Inconnu', inline: true },
                        { name: '👁️ Viewers', value: stream.viewer_count.toLocaleString(), inline: true }
                    )
                    .setImage(`https://static-cdn.jtvnw.net/previews-ttv/live_user_${username}-1280x720.jpg`)
                    .setTimestamp()
                    .setFooter({
                        text: 'Notification Twitch',
                        iconURL: client.user.displayAvatarURL()
                    });

                // Message avec ping du rôle si configuré
                const content = sub.roleId ? `<@&${sub.roleId}>` : null;

                await channel.send({
                    content: content,
                    embeds: [embed]
                });
            } else {
                // Streamer hors ligne - on reset l'ID pour le prochain live
                if (lastStreamIds[username]) {
                    console.log(`[Twitch] ${username} est maintenant hors ligne`);
                    delete lastStreamIds[username];
                }
            }
        } catch (error) {
            console.error(`[Twitch] Erreur pour ${username} :`, error.message);
        }
    }
}

module.exports = { checkTwitch };
