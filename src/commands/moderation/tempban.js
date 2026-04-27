const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tempban')
        .setDescription('Bannit temporairement un membre.')
        .addUserOption(option =>
            option.setName('utilisateur')
                .setDescription('Le membre à bannir temporairement')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('duree')
                .setDescription('Durée du bannissement en minutes')
                .setRequired(true)
                .setMinValue(1))
        .addStringOption(option =>
            option.setName('raison')
                .setDescription('La raison du bannissement')),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return interaction.reply({
                content: '❌ Vous devez avoir la permission **Bannir des membres** pour utiliser cette commande.',
                ephemeral: true
            });
        }

        const user = interaction.options.getUser('utilisateur');
        const duration = interaction.options.getInteger('duree');
        const reason = interaction.options.getString('raison') || 'Aucune raison spécifiée';
        const member = await interaction.guild.members.fetch(user.id).catch(() => null);

        if (member && !member.bannable) {
            return interaction.reply({
                content: '❌ Je ne peux pas bannir ce membre. Il a peut-être un rôle plus élevé que le mien.',
                ephemeral: true
            });
        }

        await interaction.guild.members.ban(user.id, { reason: `Tempban par ${interaction.user.tag}: ${reason}` });

        const embed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('🔨 Bannissement temporaire')
            .addFields(
                { name: 'Utilisateur', value: `${user.tag} (${user.id})`, inline: true },
                { name: 'Durée', value: `${duration} minutes`, inline: true },
                { name: 'Raison', value: reason, inline: false },
                { name: 'Modérateur', value: `${interaction.user.tag}`, inline: true }
            )
            .setFooter({ text: `Action par ${interaction.user.tag}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });

        // Débannir après la durée spécifiée
        setTimeout(async () => {
            try {
                await interaction.guild.members.unban(user.id, `Fin du tempban - ${reason}`);
                console.log(`[Tempban] ${user.tag} a été débanni.`);
            } catch (err) {
                console.error(`[Tempban] Erreur lors du débannissement de ${user.tag}:`, err);
            }
        }, duration * 60 * 1000);
    },
};
