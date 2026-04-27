const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { loadYouTubeSubscriptions, saveYouTubeSubscriptions } = require('../../utils/storage');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addyoutube')
        .setDescription('Ajouter une chaîne YouTube à la surveillance.')
        .addStringOption(option =>
            option.setName('channel_id')
                .setDescription('L\'ID de la chaîne YouTube à surveiller')
                .setRequired(true))
        .addChannelOption(option =>
            option.setName('salon')
                .setDescription('Le salon où envoyer les notifications')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('Le rôle à ping lors d\'une nouvelle vidéo')),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
            return interaction.reply({
                content: '❌ Vous devez avoir la permission **Gérer le serveur** pour utiliser cette commande.',
                ephemeral: true
            });
        }

        const channelId = interaction.options.getString('channel_id');
        const notificationChannel = interaction.options.getChannel('salon');
        const role = interaction.options.getRole('role');

        const subscriptions = loadYouTubeSubscriptions();

        if (subscriptions[channelId]) {
            return interaction.reply({
                content: `❌ Cette chaîne YouTube est déjà surveillée dans le salon <#${subscriptions[channelId].channelId}>.`,
                ephemeral: true
            });
        }

        subscriptions[channelId] = {
            channelId: notificationChannel.id,
            roleId: role ? role.id : null,
            addedBy: interaction.user.tag,
            addedAt: new Date().toISOString()
        };

        saveYouTubeSubscriptions(subscriptions);

        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('✅ Chaîne YouTube ajoutée')
            .setDescription(`La chaîne \`${channelId}\` est maintenant surveillée.`)
            .addFields(
                { name: '📺 Salon de notification', value: `<#${notificationChannel.id}>`, inline: true },
                { name: '🔔 Rôle à ping', value: role ? `<@&${role.id}>` : 'Aucun', inline: true }
            )
            .setFooter({ text: `Ajouté par ${interaction.user.tag}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
