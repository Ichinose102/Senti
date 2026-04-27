const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Rend un membre muet (ne peut plus parler).')
        .addUserOption(option =>
            option.setName('utilisateur')
                .setDescription('Le membre à rendre muet')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('duree')
                .setDescription('Durée du mute en minutes (0 = permanent)')
                .setMinValue(0)),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return interaction.reply({
                content: '❌ Vous devez avoir la permission **Modérer les membres** pour utiliser cette commande.',
                ephemeral: true
            });
        }

        const user = interaction.options.getUser('utilisateur');
        const duration = interaction.options.getInteger('duree') || 0;
        const member = await interaction.guild.members.fetch(user.id);

        if (!member.moderatable) {
            return interaction.reply({
                content: '❌ Je ne peux pas rendre muet ce membre. Il a peut-être un rôle plus élevé que le mien.',
                ephemeral: true
            });
        }

        if (member.isCommunicationDisabled()) {
            return interaction.reply({
                content: '❌ Ce membre est déjà muet.',
                ephemeral: true
            });
        }

        const muteDuration = duration > 0 ? Date.now() + (duration * 60 * 1000) : null;
        await member.timeout(muteDuration, `Mute par ${interaction.user.tag}`);

        const embed = new EmbedBuilder()
            .setColor('#FFA500')
            .setTitle('🔇 Membre rendu muet')
            .addFields(
                { name: 'Utilisateur', value: `${user.tag} (${user.id})`, inline: true },
                { name: 'Modérateur', value: `${interaction.user.tag}`, inline: true },
                { name: 'Durée', value: duration > 0 ? `${duration} minutes` : 'Permanente', inline: true }
            )
            .setFooter({ text: `Action par ${interaction.user.tag}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
