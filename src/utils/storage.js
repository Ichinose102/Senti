const fs = require('node:fs');
const path = require('node:path');

const dataPath = path.join(__dirname, '../../data');
const youtubeSubscriptionsPath = path.join(dataPath, 'youtube-subscriptions.json');
const twitchSubscriptionsPath = path.join(dataPath, 'twitch-subscriptions.json');
const tiktokSubscriptionsPath = path.join(dataPath, 'tiktok-subscriptions.json');

// Créer le dossier data s'il n'existe pas
if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(dataPath, { recursive: true });
}

// ============ YOUTUBE ============
function loadYouTubeSubscriptions() {
    if (!fs.existsSync(youtubeSubscriptionsPath)) {
        return {};
    }
    const data = fs.readFileSync(youtubeSubscriptionsPath, 'utf-8');
    return JSON.parse(data);
}

function saveYouTubeSubscriptions(data) {
    fs.writeFileSync(youtubeSubscriptionsPath, JSON.stringify(data, null, 2));
}

// ============ TWITCH ============
function loadTwitchSubscriptions() {
    if (!fs.existsSync(twitchSubscriptionsPath)) {
        return {};
    }
    const data = fs.readFileSync(twitchSubscriptionsPath, 'utf-8');
    return JSON.parse(data);
}

function saveTwitchSubscriptions(data) {
    fs.writeFileSync(twitchSubscriptionsPath, JSON.stringify(data, null, 2));
}

// ============ TIKTOK ============
function loadTikTokSubscriptions() {
    if (!fs.existsSync(tiktokSubscriptionsPath)) {
        return {};
    }
    const data = fs.readFileSync(tiktokSubscriptionsPath, 'utf-8');
    return JSON.parse(data);
}

function saveTikTokSubscriptions(data) {
    fs.writeFileSync(tiktokSubscriptionsPath, JSON.stringify(data, null, 2));
}

module.exports = {
    loadYouTubeSubscriptions,
    saveYouTubeSubscriptions,
    loadTwitchSubscriptions,
    saveTwitchSubscriptions,
    loadTikTokSubscriptions,
    saveTikTokSubscriptions
};
