const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Expulse un membre du serveur.')
        .addUserOption(option =>
            option.setName('utilisateur')
                .setDescription('Le membre à expulser')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('raison')
                .setDescription('La raison de l\'expulsion')),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return interaction.reply({
                content: '❌ Vous n\'avez pas la permission d\'expulser des membres.',
                ephemeral: true
            });
        }

        const user = interaction.options.getUser('utilisateur');
        const reason = interaction.options.getString('raison') || 'Aucune raison spécifiée';
        const member = await interaction.guild.members.fetch(user.id).catch(() => null);

        if (!member) {
            return interaction.reply({
                content: '❌ Ce membre est introuvable sur le serveur.',
                ephemeral: true
            });
        }

        if (!member.kickable) {
            return interaction.reply({
                content: '❌ Je ne peux pas expulser ce membre. Il a peut-être un rôle plus élevé que le mien.',
                ephemeral: true
            });
        }

        await member.kick(reason);

        const embed = new EmbedBuilder()
            .setColor('#FFA500')
            .setTitle('👢 Membre expulsé')
            .addFields(
                { name: 'Utilisateur', value: `${user.tag} (${user.id})`, inline: true },
                { name: 'Raison', value: reason, inline: true },
                { name: 'Modérateur', value: `${interaction.user.tag}`, inline: true }
            )
            .setFooter({ text: `Action par ${interaction.user.tag}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
