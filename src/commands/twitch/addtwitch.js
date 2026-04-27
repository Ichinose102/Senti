const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { loadTwitchSubscriptions, saveTwitchSubscriptions } = require('../../utils/storage');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addtwitch')
        .setDescription('Ajouter un streamer Twitch à la surveillance.')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('Le nom du streamer Twitch (sans le @)')
                .setRequired(true))
        .addChannelOption(option =>
            option.setName('salon')
                .setDescription('Le salon où envoyer les notifications')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('Le rôle à ping lors d\'un nouveau live')),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
            return interaction.reply({
                content: '❌ Vous devez avoir la permission **Gérer le serveur** pour utiliser cette commande.',
                ephemeral: true
            });
        }

        const username = interaction.options.getString('username').toLowerCase();
        const notificationChannel = interaction.options.getChannel('salon');
        const role = interaction.options.getRole('role');

        const subscriptions = loadTwitchSubscriptions();

        if (subscriptions[username]) {
            return interaction.reply({
                content: `❌ Ce streamer est déjà surveillé dans le salon <#${subscriptions[username].channelId}>.`,
                ephemeral: true
            });
        }

        subscriptions[username] = {
            channelId: notificationChannel.id,
            roleId: role ? role.id : null,
            addedBy: interaction.user.tag,
            addedAt: new Date().toISOString()
        };

        saveTwitchSubscriptions(subscriptions);

        const embed = new EmbedBuilder()
            .setColor('#9146FF')
            .setTitle('✅ Streamer Twitch ajouté')
            .setDescription(`Le streamer \`${username}\` est maintenant surveillé.`)
            .addFields(
                { name: '📺 Salon de notification', value: `<#${notificationChannel.id}>`, inline: true },
                { name: '🔔 Rôle à ping', value: role ? `<@&${role.id}>` : 'Aucun', inline: true }
            )
            .setFooter({ text: `Ajouté par ${interaction.user.tag}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
