const Discord = require('discord.js')
const CurrencySystem = require("currency-system");
const cs = new CurrencySystem;
module.exports.run = async (client, interaction, args) => {
    const user = interaction.options.getUser('user') || interaction.user;
    let result = await cs.getUserItems({
        user: user,
        guild: interaction.guild,
    });
    let inv = result.inventory.slice(0, 10)
    const embed = new Discord.interactionEmbed()
        .setDescription('Your Inventory in Empty!')
    for (key of inv) {
        embed.addField(`**${key.name}:**`, `Amount: ${key.amount}`);
        embed.setDescription('Your Inventory!')

    }
    return interaction.reply({
        embeds: [embed]
    })
}

module.exports.help = {
    name: "inventory",
    data: {
        name: 'inventory',
        description: "A way to see inventory",
        options: [{
            name: 'user',
            type: 'USER',
            description: 'The user you want to check inventory of..',
            required: false,
        }]
    }
};

module.exports.conf = {
    aliases: ['inv'],
    cooldown: 5 // This number is a seconds, not a milliseconds.
    // 1 = 1 seconds.
}