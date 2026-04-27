# Senti - Le Bot Officiel de l'Hyperion

![Discord.js](https://img.shields.io/badge/discord.js-v14-7289DA?style=for-the-badge&logo=discord&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Statut](https://img.shields.io/badge/statut-en%20ligne-green?style=for-the-badge)

Bienvenue sur le dépôt de **Senti**, le cœur de notre communauté Discord ! Ce bot a été développé sur mesure pour enrichir l'expérience de notre serveur, en connectant directement mes activités de streaming sur **Twitch** et mes créations sur **YouTube** et **TikTok**.

<br>

<p align="center">
  <a href="https://discord.gg/nqjWGtekKx" target="_blank">
    <img src="https://img.shields.io/badge/Rejoindre_le_Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white" alt="Discord"/>
  </a>
  <a href="https://www.twitch.tv/ichinose102" target="_blank">
    <img src="https://img.shields.io/badge/Suivre_sur_Twitch-9146FF?style=for-the-badge&logo=twitch&logoColor=white" alt="Twitch"/>
  </a>
  <a href="https://www.youtube.com/@Ichinose102" target="_blank">
    <img src="https://img.shields.io/badge/S'abonner_sur_YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white" alt="YouTube"/>
  </a>
  <a href="https://www.tiktok.com/@ichinose102" target="_blank">
    <img src="https://img.shields.io/badge/Suivre_sur_TikTok-00f2ea?style=for-the-badge&logo=tiktok&logoColor=white" alt="TikTok"/>
  </a>
</p>

## 📖 Le Projet Senti

En tant que créateur, je voulais un outil qui centralise tout. Senti est né de cette idée : créer un bot unique qui non seulement maintient notre serveur Discord propre et accueillant, mais qui agit aussi comme le pont direct avec mes contenus.

Il est conçu pour être à la fois un **gardien** et un **messager**, garantissant que personne ne manque les dernières vidéos, les prochains lives ou les nouvelles publications TikTok.

---

## ✨ Fonctionnalités Clés

### 📺 Alertes YouTube Automatiques
- Surveille ma chaîne YouTube 24/7
- Publie une notification riche et stylisée dans le salon configuré
- Affiche la miniature, le titre et le lien de la vidéo
- Ping de rôle configurable

### 🎮 Notifications Twitch en Direct
- Détection automatique des lives
- Affiche le jeu, le nombre de viewers et la miniature en temps réel
- Notification instantanée dans le salon configuré
- Supporte plusieurs streamers simultanément

### 🎵 Alertes TikTok
- Surveillance des nouvelles vidéos
- Embed stylisé avec lien direct
- Aucune API externe requise (web scraping)

### 🛡️ Suite de Modération Complète
- `/ban` - Bannir un membre
- `/kick` - Expulser un membre
- `/clear` - Supprimer des messages (max 100)
- `/mute` - Rendre muet temporairement ou permanent
- `/unmute` - Rétablir la parole
- `/warn` - Donner un avertissement (DM + public)
- `/tempban` - Bannir temporairement

### ⚙️ Utilitaires
- `/ping` - Vérifier la latence du bot
- Gestion multi-plateformes (YouTube, Twitch, TikTok)
- Rôles pingables configurables par notification

---

## 🚀 Hébergement et Technologie

Pour garantir une disponibilité 24/7, Senti est hébergé gratuitement grâce à une combinaison intelligente :

- **[Replit](https://replit.com/)** : pour l'exécution du code Node.js dans le cloud
- **[UptimeRobot](https://uptimerobot.com/)** : pour s'assurer que le bot ne se met jamais en veille

Cette configuration assure que le bot est toujours prêt à annoncer une nouvelle vidéo ou à répondre à une commande, à toute heure du jour ou de la nuit.

---

## 🔧 Configuration

### Installation Locale

1. **Cloner le projet**
```bash
git clone <repository>
cd Senti
npm install
```

2. **Configurer les variables d'environnement**

Créez un fichier `.env` à la racine :

```env
# Discord (obligatoire)
DISCORD_TOKEN=votre_token_discord
CLIENT_ID=votre_client_id
GUILD_ID=votre_id_de_serveur

# Twitch (pour les notifications Twitch)
TWITCH_CLIENT_ID=votre_client_id_twitch
TWITCH_ACCESS_TOKEN=votre_token_twitch

# TikTok (optionnel, pas d'API requise)
# Aucune configuration supplémentaire nécessaire
```

3. **Déployer les commandes**
```bash
node deploy-commands.js
```

4. **Lancer le bot**
```bash
node index.js
```

### Obtenir le Token Twitch

1. Allez sur [dev.twitch.tv/console](https://dev.twitch.tv/console)
2. Créez une application
3. Récupérez votre `Client ID` et `Client Secret`
4. Exécutez cette commande pour obtenir le token :

```bash
curl -X POST 'https://id.twitch.tv/oauth2/token' \
  -d 'client_id=VOTRE_CLIENT_ID' \
  -d 'client_secret=VOTRE_CLIENT_SECRET' \
  -d 'grant_type=client_credentials'
```

### TikTok

Aucune configuration supplémentaire n'est requise. Le bot récupère directement les vidéos via le site de TikTok.

---

## 📋 Commandes Disponibles

### Modération
| Commande | Description | Permissions |
|----------|-------------|-------------|
| `/ban` | Bannir un membre | BanMembers |
| `/kick` | Expulser un membre | KickMembers |
| `/clear` | Supprimer des messages | ManageMessages |
| `/mute` | Rendre muet | ModerateMembers |
| `/unmute` | Démuter | ModerateMembers |
| `/warn` | Avertir | ModerateMembers |
| `/tempban` | Bannir temporairement | BanMembers |

### YouTube
| Commande | Description | Permissions |
|----------|-------------|-------------|
| `/addyoutube` | Ajouter une chaîne | ManageGuild |
| `/removeyoutube` | Supprimer une chaîne | ManageGuild |
| `/listyoutube` | Lister les chaînes | - |
| `/setyoutube` | Modifier les paramètres | ManageGuild |

### Twitch
| Commande | Description | Permissions |
|----------|-------------|-------------|
| `/addtwitch` | Ajouter un streamer | ManageGuild |
| `/removetwitch` | Supprimer un streamer | ManageGuild |
| `/listtwitch` | Lister les streamers | - |
| `/settwitch` | Modifier les paramètres | ManageGuild |

### TikTok
| Commande | Description | Permissions |
|----------|-------------|-------------|
| `/addtiktok` | Ajouter un créateur | ManageGuild |
| `/removetiktok` | Supprimer un créateur | ManageGuild |
| `/listtiktok` | Lister les créateurs | - |
| `/settiktok` | Modifier les paramètres | ManageGuild |

### Utilitaires
| Commande | Description |
|----------|-------------|
| `/ping` | Vérifier la latence |

---

## 📁 Structure du Projet

```
Senti/
├── index.js                 # Point d'entrée principal
├── deploy-commands.js       # Déploie les commandes slash
├── .env                     # Variables d'environnement (secrets)
├── .env.example             # Exemple de configuration
├── data/                    # Données persistantes
│   ├── youtube-subscriptions.json
│   ├── twitch-subscriptions.json
│   └── tiktok-subscriptions.json
└── src/
    ├── config.json          # Configuration globale
    ├── commands/
    │   ├── moderation/      # Commandes de modération
    │   ├── youtube/         # Commandes YouTube
    │   ├── twitch/          # Commandes Twitch
    │   └── tiktok/          # Commandes TikTok
    ├── components/
    │   ├── youtubeNotifier.js
    │   ├── twitchNotifier.js
    │   └── tiktokNotifier.js
    ├── events/
    │   ├── ready.js
    │   └── interactionCreate.js
    └── utils/
        └── storage.js       # Gestion du stockage JSON
```

---

## 🛠️ Technologies Utilisées

- **[discord.js](https://discord.js.org/)** v14 - Framework Discord
- **[Node.js](https://nodejs.org/)** v20+ - Runtime JavaScript
- **[rss-parser](https://www.npmjs.com/package/rss-parser)** - Parsing des flux RSS YouTube
- **[Twitch API](https://dev.twitch.tv/docs/api/)** - Données des streams
- **[axios](https://axios-http.com/)** & **[cheerio](https://cheerio.js.org/)** - Web scraping TikTok

---

## 📝 Licence

Ce projet est propriétaire et réservé à l'usage du serveur Discord **l'Hyperion**.

---

## 👨‍💻 Créateur

**Ichinose102**
- [YouTube](https://www.youtube.com/@Ichinose102)
- [Twitch](https://www.twitch.tv/ichinose102)
- [TikTok](https://www.tiktok.com/@ichinose102)
- [Discord](https://discord.gg/nqjWGtekKx)

---

## 🤝 Contribuer

Si vous souhaitez contribuer ou signaler un bug, veuillez contacter l'équipe de modération sur le serveur Discord.
