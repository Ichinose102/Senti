const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { loadTwitchSubscriptions, saveTwitchSubscriptions } = require('../../utils/storage');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('settwitch')
        .setDescription('Modifier les paramètres d\'un streamer Twitch surveillé.')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('Le nom du streamer Twitch à modifier')
                .setRequired(true))
        .addChannelOption(option =>
            option.setName('salon')
                .setDescription('Le nouveau salon de notification'))
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('Le nouveau rôle à ping (laisser vide pour aucun)')),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
            return interaction.reply({
                content: '❌ Vous devez avoir la permission **Gérer le serveur** pour utiliser cette commande.',
                ephemeral: true
            });
        }

        const username = interaction.options.getString('username').toLowerCase();
        const subscriptions = loadTwitchSubscriptions();

        if (!subscriptions[username]) {
            return interaction.reply({
                content: `❌ Aucun streamer \`${username}\` n'est surveillé.`,
                ephemeral: true
            });
        }

        const notificationChannel = interaction.options.getChannel('salon');
        const role = interaction.options.getRole('role');

        if (notificationChannel) {
            subscriptions[username].channelId = notificationChannel.id;
        }
        if (role !== null) {
            subscriptions[username].roleId = role ? role.id : null;
        }

        saveTwitchSubscriptions(subscriptions);

        const sub = subscriptions[username];
        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('✅ Paramètres mis à jour')
            .setDescription(`Paramètres du streamer \`${username}\` mis à jour.`)
            .addFields(
                { name: '📺 Salon de notification', value: `<#${sub.channelId}>`, inline: true },
                { name: '🔔 Rôle à ping', value: sub.roleId ? `<@&${sub.roleId}>` : 'Aucun', inline: true }
            )
            .setFooter({ text: `Mis à jour par ${interaction.user.tag}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
