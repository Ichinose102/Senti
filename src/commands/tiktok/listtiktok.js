const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { loadTikTokSubscriptions } = require('../../utils/storage');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('listtiktok')
        .setDescription('Lister tous les créateurs TikTok surveillés.'),
    async execute(interaction) {
        const subscriptions = loadTikTokSubscriptions();
        const creators = Object.keys(subscriptions);

        if (creators.length === 0) {
            return interaction.reply({
                content: '📭 Aucun créateur TikTok n\'est actuellement surveillé.',
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder()
            .setColor('#00f2ea')
            .setTitle('🎵 Créateurs TikTok surveillés')
            .setDescription(`Total : **${creators.length}** créateur(s)`);

        for (const username of creators) {
            const sub = subscriptions[username];
            const channelMention = `<#${sub.channelId}>`;
            const roleMention = sub.roleId ? `<@&${sub.roleId}>` : 'Aucun';

            embed.addFields({
                name: `📌 @${username}`,
                value: `Salon : ${channelMention}\nRôle : ${roleMention}`,
                inline: false
            });
        }

        embed.setFooter({ text: `Demandé par ${interaction.user.tag}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
