# Senti - Le Bot Officiel de l'Hyperion

![Discord.js](https://img.shields.io/badge/discord.js-v14-7289DA?style=for-the-badge&logo=discord&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Statut](https://img.shields.io/badge/statut-en%20ligne-green?style=for-the-badge)

Bienvenue sur le dépôt de **Senti**, le cœur de notre communauté Discord ! Ce bot a été développé sur mesure pour enrichir l'expérience de notre serveur, en connectant directement mes activités de streaming sur **Twitch** et mes créations sur **YouTube**.

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
</p>

## 📖 Le Projet Senti

En tant que créateur, je voulais un outil qui centralise tout. Senti est né de cette idée : créer un bot unique qui non seulement maintient notre serveur Discord propre et accueillant, mais qui agit aussi comme le pont direct avec mes contenus.

Il est conçu pour être à la fois un **gardien** et un **messager**, garantissant que personne ne manque les dernières vidéos ou les prochains lives.

---

## ✨ Fonctionnalités Clés

Senti est équipé pour gérer les aspects les plus importants de notre communauté :

* 📺 **Alertes YouTube Automatiques**
    * Surveille ma chaîne YouTube 24/7.
    * Publie une notification riche et stylisée dans le salon `#annonces` dès qu'une nouvelle vidéo est en ligne. Fini les annonces manuelles !

* 🛡️ **Outils de Modération Essentiels**
    * Une suite de commandes `/` simples pour que la modération soit rapide et efficace.
    * `/ban`, `/kick`, `/clear` : tout ce qu'il faut pour garder un environnement sain et respectueux pour tout le monde.

* ⚙️ **Utilitaire de Base**
    * `/ping` : Une commande simple pour vérifier que le bot est bien éveillé et réactif.

---

## 🚀 Hébergement et Technologie

Pour garantir une disponibilité 24/7, Senti est hébergé gratuitement grâce à une combinaison intelligente :

* **[Replit](https://replit.com/)** : pour l'exécution du code Node.js dans le cloud.
* **[UptimeRobot](https://uptimerobot.com/)** : pour s'assurer que le bot ne se met jamais en veille.

Cette configuration assure que le bot est toujours prêt à annoncer une nouvelle vidéo ou à répondre à une commande, à toute heure du jour ou de la nuit.

---

## 🔧 Configuration Personnelle

Le bot est configuré via deux fichiers principaux pour une séparation claire entre les secrets et les paramètres.

#### Fichier `.env` (Secrets Locaux)
Ce fichier reste sur mon ordinateur et n'est jamais partagé. Il contient toutes les clés sensibles.

```env
# Token d'authentification du bot
DISCORD_TOKEN=VOTRE_TOKEN_DISCORD

# ID de l'application (Client ID)
CLIENT_ID=VOTRE_ID_CLIENT

# ID du serveur Discord de la communauté
GUILD_ID=VOTRE_ID_DE_SERVEUR