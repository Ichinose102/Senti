const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { loadYouTubeSubscriptions } = require('../../utils/storage');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('listyoutube')
        .setDescription('Lister toutes les chaînes YouTube surveillées.'),
    async execute(interaction) {
        const subscriptions = loadYouTubeSubscriptions();
        const channels = Object.keys(subscriptions);

        if (channels.length === 0) {
            return interaction.reply({
                content: '📭 Aucune chaîne YouTube n\'est actuellement surveillée.',
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('📺 Chaînes YouTube surveillées')
            .setDescription(`Total : **${channels.length}** chaîne(s)`);

        for (const channelId of channels) {
            const sub = subscriptions[channelId];
            const channelMention = `<#${sub.channelId}>`;
            const roleMention = sub.roleId ? `<@&${sub.roleId}>` : 'Aucun';

            embed.addFields({
                name: `📌 ${channelId}`,
                value: `Salon : ${channelMention}\nRôle : ${roleMention}`,
                inline: false
            });
        }

        embed.setFooter({ text: `Demandé par ${interaction.user.tag}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
