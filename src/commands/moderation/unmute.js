const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Permet à nouveau à un membre de parler.'),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return interaction.reply({
                content: '❌ Vous devez avoir la permission **Modérer les membres** pour utiliser cette commande.',
                ephemeral: true
            });
        }

        const user = interaction.options.getUser('utilisateur');
        const member = await interaction.guild.members.fetch(user.id);

        if (!member.isCommunicationDisabled()) {
            return interaction.reply({
                content: '❌ Ce membre n\'est pas muet.',
                ephemeral: true
            });
        }

        await member.timeout(null, `Unmute par ${interaction.user.tag}`);

        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('🔊 Membre démuté')
            .addFields(
                { name: 'Utilisateur', value: `${user.tag} (${user.id})`, inline: true },
                { name: 'Modérateur', value: `${interaction.user.tag}`, inline: true }
            )
            .setFooter({ text: `Action par ${interaction.user.tag}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
