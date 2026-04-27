const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { loadYouTubeSubscriptions, saveYouTubeSubscriptions } = require('../../utils/storage');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removeyoutube')
        .setDescription('Supprimer une chaîne YouTube de la surveillance.')
        .addStringOption(option =>
            option.setName('channel_id')
                .setDescription('L\'ID de la chaîne YouTube à retirer de la surveillance')
                .setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
            return interaction.reply({
                content: '❌ Vous devez avoir la permission **Gérer le serveur** pour utiliser cette commande.',
                ephemeral: true
            });
        }

        const channelId = interaction.options.getString('channel_id');
        const subscriptions = loadYouTubeSubscriptions();

        if (!subscriptions[channelId]) {
            return interaction.reply({
                content: `❌ Aucune surveillance active pour la chaîne \`${channelId}\`.`,
                ephemeral: true
            });
        }

        delete subscriptions[channelId];
        saveYouTubeSubscriptions(subscriptions);

        const embed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('🗑️ Chaîne YouTube retirée')
            .setDescription(`La chaîne \`${channelId}\` n'est plus surveillée.`)
            .setFooter({ text: `Retiré par ${interaction.user.tag}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
