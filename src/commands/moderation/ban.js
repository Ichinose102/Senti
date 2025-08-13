const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bannit un membre du serveur.')
        .addUserOption(option => 
            option.setName('utilisateur')
                .setDescription('Le membre à bannir')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('raison')
                .setDescription('La raison du bannissement')),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return interaction.reply({ content: 'Vous n\'avez pas la permission de bannir des membres.', ephemeral: true });
        }

        const user = interaction.options.getUser('utilisateur');
        const reason = interaction.options.getString('raison') || 'Aucune raison spécifiée';
        const member = interaction.guild.members.cache.get(user.id);

        if (!member.bannable) {
            return interaction.reply({ content: 'Je ne peux pas bannir ce membre.', ephemeral: true });
        }

        await member.ban({ reason });
        await interaction.reply(`:no_entry: ${user.tag} a été banni. Raison : ${reason}`);
    },
};