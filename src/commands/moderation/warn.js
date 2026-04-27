const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Donne un avertissement à un membre.')
        .addUserOption(option =>
            option.setName('utilisateur')
                .setDescription('Le membre à avertir')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('raison')
                .setDescription('La raison de l\'avertissement')
                .setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return interaction.reply({
                content: '❌ Vous devez avoir la permission **Modérer les membres** pour utiliser cette commande.',
                ephemeral: true
            });
        }

        const user = interaction.options.getUser('utilisateur');
        const reason = interaction.options.getString('raison');
        const member = await interaction.guild.members.fetch(user.id);

        if (!member) {
            return interaction.reply({
                content: '❌ Ce membre est introuvable sur le serveur.',
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder()
            .setColor('#FFA500')
            .setTitle('⚠️ Avertissement')
            .setDescription(`Vous avez reçu un avertissement sur le serveur **${interaction.guild.name}**.`)
            .addFields(
                { name: 'Raison', value: reason },
                { name: 'Modérateur', value: `${interaction.user.tag}`, inline: true }
            )
            .setFooter({ text: `Action par ${interaction.user.tag}` })
            .setTimestamp();

        // Envoyer un DM à l'utilisateur
        try {
            await user.send({ embeds: [embed] });
        } catch (err) {
            console.log('Impossible d\'envoyer un DM à l\'utilisateur');
        }

        // Réponse publique
        const publicEmbed = new EmbedBuilder()
            .setColor('#FFA500')
            .setTitle('✅ Avertissement donné')
            .addFields(
                { name: 'Utilisateur', value: `${user.tag} (${user.id})`, inline: true },
                { name: 'Raison', value: reason, inline: true },
                { name: 'Modérateur', value: `${interaction.user.tag}`, inline: true }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [publicEmbed] });
    },
};
