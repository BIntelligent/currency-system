const CurrencySystem = require("currency-system");
const cs = new CurrencySystem;
module.exports.run = async (client, interaction, args) => {
    let wheretoPutMoney = args.get('where_to_put_money');
    if (wheretoPutMoney) wheretoPutMoney = 'bank';
    else wheretoPutMoney = 'wallet';
    let amount = args.get('amount')
    let money = parseInt(amount);
    let result = await cs.removeMoneyFromAllUsers({
        guild: interaction.guild.id,
        amount: money,
        wheretoPutMoney: wheretoPutMoney
    });
    if (result.error) {
        if (result.type === 'negative-money') return interaction.reply("You cant remove negitive money");
        else return interaction.reply('No User\'s found');
    } else interaction.reply(`Successfully removed $${money} from ${result.rawData.length} people!, ( in ${wheretoPutMoney} )`)
}

module.exports.help = {
    name: "removemoneyfromallusers",
    data: {
        name: 'removemoneyfromallusers',
        description: "A way to remove the amount  of money in everyone's bank or wallet.",
        options: [{
                name: 'amount',
                type: 'INTEGER',
                description: 'Amount of money you want to remove.',
                required: true,
            },
            {
                name: 'where_to_put_money',
                type: 'BOOLEAN',
                description: 'TRUE means bank, FALSE means wallet.',
                required: true,
            }
        ]
    }
}