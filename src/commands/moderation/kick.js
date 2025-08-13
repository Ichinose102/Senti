const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

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
        // Vérifie si l'utilisateur a la permission d'expulser
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return interaction.reply({ content: 'Vous n\'avez pas la permission d\'expulser des membres.', ephemeral: true });
        }

        const user = interaction.options.getUser('utilisateur');
        const reason = interaction.options.getString('raison') || 'Aucune raison spécifiée';
        // Récupère l'objet membre du serveur pour pouvoir l'expulser
        const member = await interaction.guild.members.fetch(user.id);

        // Vérifie si le bot PEUT expulser ce membre (rôles, etc.)
        if (!member.kickable) {
            return interaction.reply({ content: 'Je ne peux pas expulser ce membre. Il a peut-être un rôle plus élevé que le mien.', ephemeral: true });
        }

        await member.kick(reason);
        await interaction.reply(`:boot: ${user.tag} a été expulsé. Raison : ${reason}`);
    },
};