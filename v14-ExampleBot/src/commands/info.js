const Discord = require('discord.js')
const CurrencySystem = require("currency-system");
const cs = new CurrencySystem;
module.exports.run = async (client, interaction, args) => {
    // Command Start's here
    let result = await cs.info(interaction.user.id, interaction.guild.id);
    const embed = new Discord.EmbedBuilder()
        .setDescription('Info about ' + interaction.user.tag);
    let unUsed = '';
    let cantBeUsed = '';
    for (const [key, value] of result.info) {
        if (value.used) unUsed += `- ${key}\n`;
        else cantBeUsed += `- ${key} ( ${value.timeLeft} )\n`;
    }
    embed.addFields([
        { name: 'Commands that you can use:', value: unUsed || 'None' },
        { name: 'Commands that you can\'t use:', value: cantBeUsed || 'None' },
    ])
    interaction.reply({
        embeds: [embed]
    })
    // Commands Stop's here.
}

module.exports.help = {
    name: "info",
    data: {
        name: 'info',
        description: "A way to info to shop",
        options: []
    }
};

module.exports.conf = {
    aliases: ['i'],
    cooldown: 5 // This number is a seconds, not a milliseconds.
    // 1 = 1 seconds.
}