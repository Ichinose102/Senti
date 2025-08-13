// index.js
const { Client, GatewayIntentBits, Collection, PermissionsBitField } = require('discord.js');
const RssParser = require('rss-parser');
require('dotenv').config();

// --- ⬇️ CONFIGURATION À CHANGER ⬇️ ---
const YOUTUBE_CHANNEL_ID = 'UC_x5XG1OV2P6uZZ5FSM9Ttw'; // Remplacez par l'ID de la chaîne YouTube (Ex: Squeezie)
const NOTIFICATION_CHANNEL_ID = 'VOTRE_ID_DE_SALON_POUR_LES_NOTIFS'; // Remplacez par l'ID du salon de notification
const CHECK_INTERVAL = 60000 * 5; // Temps en millisecondes entre chaque vérification (ici, 5 minutes)
// --- ⬆️ FIN DE LA CONFIGURATION ⬆️ ---

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

const parser = new RssParser();
let lastVideoId = '';

const checkYouTube = async () => {
    try {
        const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`;
        const feed = await parser.parseURL(feedUrl);
        
        if (!feed.items.length) return;
        const latestVideo = feed.items[0];

        if (!lastVideoId) {
            lastVideoId = latestVideo.id;
            console.log(`Initialisation terminée. Dernière vidéo de ${feed.title} : ${latestVideo.title}`);
            return;
        }

        if (latestVideo.id !== lastVideoId) {
            console.log(`Nouvelle vidéo détectée : ${latestVideo.title}`);
            lastVideoId = latestVideo.id;

            const channel = await client.channels.fetch(NOTIFICATION_CHANNEL_ID);
            if (channel) {
                const message = `🚨 **NOUVELLE VIDÉO !** 🚨\n\n**${feed.title}** a publié : **${latestVideo.title}**\n${latestVideo.link}`;
                channel.send(message);
            }
        }
    } catch (error) {
        console.error('Erreur lors de la vérification de YouTube :', error);
    }
};

client.once('ready', () => {
    console.log(`Connecté en tant que ${client.user.tag} !`);
    checkYouTube(); 
    setInterval(checkYouTube, CHECK_INTERVAL);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    const { commandName, options } = interaction;

    if (commandName === 'ping') {
        await interaction.reply('Pong!');
    } 
    
    else if (commandName === 'clear') {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return interaction.reply({ content: 'Vous n\'avez pas la permission de gérer les messages.', ephemeral: true });
        }
        const amount = options.getInteger('nombre');
        if (amount < 1 || amount > 100) {
            return interaction.reply({ content: 'Vous devez choisir un nombre entre 1 et 100.', ephemeral: true });
        }
        await interaction.channel.bulkDelete(amount, true).catch(error => {
            console.error(error);
            interaction.reply({ content: 'Une erreur est survenue. Les messages sont peut-être trop anciens (+14 jours).', ephemeral: true });
        });
        await interaction.reply({ content: `✅ ${amount} messages ont été supprimés.`, ephemeral: true });
    }

    else if (commandName === 'kick') {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return interaction.reply({ content: 'Vous n\'avez pas la permission d\'expulser des membres.', ephemeral: true });
        }
        const user = options.getUser('utilisateur');
        const reason = options.getString('raison') || 'Aucune raison spécifiée';
        const member = interaction.guild.members.cache.get(user.id);
        if (!member.kickable) {
            return interaction.reply({ content: 'Je ne peux pas expulser ce membre.', ephemeral: true });
        }
        await member.kick(reason);
        await interaction.reply({ content: ` expulsé. Raison : ${reason}` });
    }

    else if (commandName === 'ban') {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return interaction.reply({ content: 'Vous n\'avez pas la permission de bannir des membres.', ephemeral: true });
        }
        const user = options.getUser('utilisateur');
        const reason = options.getString('raison') || 'Aucune raison spécifiée';
        const member = interaction.guild.members.cache.get(user.id);
         if (!member.bannable) {
            return interaction.reply({ content: 'Je ne peux pas bannir ce membre.', ephemeral: true });
        }
        await member.ban({ reason });
        await interaction.reply({ content: ` banni. Raison : ${reason}` });
    }
});

client.login(process.env.DISCORD_TOKEN);