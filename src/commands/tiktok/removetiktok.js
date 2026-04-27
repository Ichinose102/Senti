const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { loadTikTokSubscriptions, saveTikTokSubscriptions } = require('../../utils/storage');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removetiktok')
        .setDescription('Supprimer un créateur TikTok de la surveillance.')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('Le nom du créateur TikTok à retirer')
                .setRequired(true)),
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

        delete subscriptions[username];
        saveTikTokSubscriptions(subscriptions);

        const embed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('🗑️ Créateur TikTok retiré')
            .setDescription(`Le créateur \`${username}\` n'est plus surveillé.`)
            .setFooter({ text: `Retiré par ${interaction.user.tag}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
