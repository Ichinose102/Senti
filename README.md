Senti - Bot Discord Multifonction
Un bot de modération et de notifications YouTube, conçu pour être simple, efficace et entièrement personnalisable.

<br>

📖 À propos du projet
Senti a été créé pour répondre à deux besoins essentiels sur un serveur Discord : une modération fiable et des notifications de contenu pertinentes. Il utilise la dernière version de discord.js (v14) et une structure de projet moderne qui rend l'ajout de nouvelles fonctionnalités très facile.

Que ce soit pour maintenir un environnement sain avec des outils de modération clairs ou pour tenir votre communauté informée des dernières vidéos de vos créateurs préférés, Senti est l'outil qu'il vous faut.

✨ Fonctionnalités
🛡️ Modération complète : Commandes slash intuitives pour gérer les membres.

/ban : Bannit un membre définitivement.

/kick : Expulse un membre du serveur.

/clear : Supprime un nombre défini de messages dans un salon.

📺 Notifications YouTube : Surveille une chaîne YouTube et publie une alerte avec un bel embed dès la sortie d'une nouvelle vidéo.

⚙️ Utilitaire : Commandes de base pour vérifier l'état du bot.

/ping : Affiche la latence du bot pour s'assurer qu'il répond bien.

🚀 Installation
Pour héberger votre propre instance de Senti, suivez ces étapes.

Prérequis
Node.js (version 20.x ou supérieure recommandée)

Un compte Discord et un serveur où vous avez les droits administrateur.

Étapes
Clonez le dépôt

Bash

git clone https://github.com/votre-pseudo/senti.git
cd senti
Installez les dépendances

Bash

npm install
Configurez le bot

Créez un fichier .env à la racine du projet en vous basant sur le modèle ci-dessous.

Modifiez le fichier src/config.json pour définir la chaîne YouTube et le salon de notification.

Déployez les commandes slash

Bash

npm run deploy
Lancez le bot

Bash

npm run start
🔧 Configuration
Senti se configure via deux fichiers très simples.

Fichier .env (pour les secrets)
Ce fichier contient vos informations sensibles et ne doit JAMAIS être partagé.

Extrait de code

# Le token secret de votre bot
DISCORD_TOKEN=VOTRE_TOKEN_DISCORD

# L'ID de l'application (Client ID) de votre bot
CLIENT_ID=VOTRE_ID_CLIENT

# L'ID du serveur où vous déployez les commandes (Guild ID)
GUILD_ID=VOTRE_ID_DE_SERVEUR
Fichier src/config.json (pour la configuration publique)
JSON

{
    "youtubeChannelId": "L_ID_DE_LA_CHAINE_YOUTUBE_A_SURVEILLER",
    "notificationChannelId": "L_ID_DU_SALON_DISCORD_POUR_LES_NOTIFICATIONS",
    "checkInterval": 300000
}
🤖 Commandes disponibles
/ban <utilisateur> [raison] - Bannit un membre du serveur.

/kick <utilisateur> [raison] - Expulse un membre du serveur.

/clear <nombre> - Supprime entre 1 et 100 messages dans un salon.

/ping - Vérifie la latence du bot et de l'API Discord.

🤝 Contribuer
Les contributions sont ce qui rend la communauté open source si incroyable. Toute contribution que vous apporterez sera grandement appréciée.

Forkez le projet.

Créez votre branche de fonctionnalité (git checkout -b feature/NouvelleFonctionnalite).

Commitez vos changements (git commit -m 'Ajout de NouvelleFonctionnalite').

Poussez vers la branche (git push origin feature/NouvelleFonctionnalite).

Ouvrez une Pull Request.

📜 Licence
Distribué sous la licence MIT. Voir LICENSE pour plus d'informations.