const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Supprime un nombre de messages spécifié (max 100).')
        .addIntegerOption(option =>
            option.setName('nombre')
                .setDescription('Le nombre de messages à supprimer')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100)),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return interaction.reply({
                content: '❌ Vous n\'avez pas la permission de gérer les messages.',
                ephemeral: true
            });
        }

        const amount = interaction.options.getInteger('nombre');

        await interaction.channel.bulkDelete(amount, true).catch(error => {
            console.error(error);
            return interaction.reply({
                content: '❌ Une erreur est survenue. Impossible de supprimer des messages datant de plus de 14 jours.',
                ephemeral: true
            });
        });

        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('🧹 Messages supprimés')
            .addFields(
                { name: 'Nombre de messages', value: `${amount}`, inline: true },
                { name: 'Modérateur', value: `${interaction.user.tag}`, inline: true }
            )
            .setFooter({ text: `Action par ${interaction.user.tag}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
