const CurrencySystem = require("currency-system");
const cs = new CurrencySystem;
module.exports.run = async (client, interaction, args) => {
    const user = interaction.options.getUser('user') || interaction.user;

    let result = await cs.setBankSpace(user.id, interaction.guild.id, interaction.options.getInteger('amount') || 0);
    if (result.error) {
        if (result.type === 'no-amount-provided') return interaction.reply('Please provide number to setBank Limit to.');
        else return interaction.reply('Something went wrong., maybe same amount provided');
    } else return interaction.reply(`Successfully set Bank Limit of ${user.tag} to ${result.amount}`)

}

module.exports.help = {
    name: "setbankspace",
    data: {
        name: 'setbankspace',
        description: "A way to know the amount  of money in your bank.",
        options: [{
            name: 'user',
            type: 6,
            description: 'The user you want to set bank space of..',
            required: true,
        }, {
            name: 'amount',
            type: 4,
            description: 'Amount fo bank space you want to set.',
            required: true,
        }]
    }
}

module.exports.conf = {
    aliases: ["sets"],
    cooldown: 5
}