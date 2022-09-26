const {
    interactionActionRow,
    interactionButton,
    EmbedBuilder,
    interactionAttachment
} = require('discord.js');
module.exports.run = async (client, interaction, args) => {
    //const channel = interaction.options.getChannel('channel');
    // const query = interaction.options.getString('suggestion');
    // console.log(args)
    const channel = args[0].channel;
    const query = args[1].value;
    const embed = new EmbedBuilder()
        .setTitle('Suggestion')
        .setDescription(query)
        .setColor(0x00AE86)
        .setTimestamp();

    await channel.send({
        embeds: [embed]
    });
    interaction.reply({
        content: 'Suggestion sent!',
        ephemeral: true
    });
}

module.exports.help = {
    name: "suggest",
    data: {
        name: 'suggest',
        description: "suggest stuff here",
        options: [{
            name: 'channel',
            type: 7,
            description: 'Channel you want to send suggestion in',
            required: true,
        }, {
            name: 'suggestion',
            type: 3,
            description: 'Suggestion itself',
            required: true,
        }]
    }
}