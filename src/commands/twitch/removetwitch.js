const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { loadTwitchSubscriptions, saveTwitchSubscriptions } = require('../../utils/storage');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removetwitch')
        .setDescription('Supprimer un streamer Twitch de la surveillance.')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('Le nom du streamer Twitch à retirer')
                .setRequired(true)),
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

        delete subscriptions[username];
        saveTwitchSubscriptions(subscriptions);

        const embed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('🗑️ Streamer Twitch retiré')
            .setDescription(`Le streamer \`${username}\` n'est plus surveillé.`)
            .setFooter({ text: `Retiré par ${interaction.user.tag}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
