const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { loadTwitchSubscriptions } = require('../../utils/storage');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('listtwitch')
        .setDescription('Lister tous les streamers Twitch surveillés.'),
    async execute(interaction) {
        const subscriptions = loadTwitchSubscriptions();
        const streamers = Object.keys(subscriptions);

        if (streamers.length === 0) {
            return interaction.reply({
                content: '📭 Aucun streamer Twitch n\'est actuellement surveillé.',
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder()
            .setColor('#9146FF')
            .setTitle('🎮 Streamers Twitch surveillés')
            .setDescription(`Total : **${streamers.length}** streamer(s)`);

        for (const username of streamers) {
            const sub = subscriptions[username];
            const channelMention = `<#${sub.channelId}>`;
            const roleMention = sub.roleId ? `<@&${sub.roleId}>` : 'Aucun';

            embed.addFields({
                name: `📌 ${username}`,
                value: `Salon : ${channelMention}\nRôle : ${roleMention}`,
                inline: false
            });
        }

        embed.setFooter({ text: `Demandé par ${interaction.user.tag}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
