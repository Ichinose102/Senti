const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { loadTikTokSubscriptions, saveTikTokSubscriptions } = require('../../utils/storage');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('settiktok')
        .setDescription('Modifier les paramètres d\'un créateur TikTok surveillé.')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('Le nom du créateur TikTok à modifier')
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
        const subscriptions = loadTikTokSubscriptions();

        if (!subscriptions[username]) {
            return interaction.reply({
                content: `❌ Aucun créateur \`${username}\` n'est surveillé.`,
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

        saveTikTokSubscriptions(subscriptions);

        const sub = subscriptions[username];
        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('✅ Paramètres mis à jour')
            .setDescription(`Paramètres du créateur \`${username}\` mis à jour.`)
            .addFields(
                { name: '📱 Salon de notification', value: `<#${sub.channelId}>`, inline: true },
                { name: '🔔 Rôle à ping', value: sub.roleId ? `<@&${sub.roleId}>` : 'Aucun', inline: true }
            )
            .setFooter({ text: `Mis à jour par ${interaction.user.tag}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
