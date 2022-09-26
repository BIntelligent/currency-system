const Discord = require('discord.js')
const CurrencySystem = require("currency-system");
const cs = new CurrencySystem;
module.exports.run = async (client, interaction, args) => {
    if (!args[0].value) return interaction.reply('Which item to remove?')
    let result = await cs.removeItem({
        guild: interaction.guild,
        item: parseInt(args[0].value)
    });
    if (result.error) {
        if (result.type == 'Invalid-Item-Number') return interaction.reply('There was a error, Please enter item number to remove.!')
        if (result.type == 'Unknown-Item') return interaction.reply('There was a error, The Item Does not exist!')
    } else interaction.reply('Done! Successfully removed the `' + result.inventory.name + '` from shop!')



}

module.exports.help = {
    name: "removeitem",
    data: {
        name: 'removeitem',
        description: "A way to removeItem to shop",
        options: [{
            name: 'item',
            type: 4,
            description: 'Item number you want to remove',
            required: false,
        }]
    }
};

module.exports.conf = {
    aliases: [],
    cooldown: 5 // This number is a seconds, not a milliseconds.
    // 1 = 1 seconds.
}