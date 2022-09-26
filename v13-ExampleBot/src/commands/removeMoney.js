const CurrencySystem = require("currency-system");
const cs = new CurrencySystem;
module.exports.run = async (client, interaction, args) => {
    let user = args[2].member || interaction.member;
    if (!interaction.member.permissions.has('ADMINISTRATOR')) return interaction.reply("You do not have requied permissions.")
    let wheretoPutMoney = args.get('where_to_put_money');
    if (wheretoPutMoney) wheretoPutMoney = 'bank';
    else wheretoPutMoney = 'wallet';
    let amount = args.get('amount')
    let money = parseInt(amount);
    let result = await cs.removeMoney({
        user: user,
        guild: interaction.guild,
        amount: money,
        wheretoPutMoney: wheretoPutMoney
    });
    if (result.error) return interaction.reply("You cant remove negitive money");
    else interaction.reply(`Successfully removed $${money} to ${user.user.username}, ( from ${wheretoPutMoney} )`)
}

module.exports.help = {
    name: "removemoney",
    data: {
        name: 'removemoney',
        description: "A way to remove the amount  of money from bank or wallet.",
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
            },
            {
                name: 'user',
                type: 'USER',
                description: 'The user you want to remove money to.',
                required: false,
            }
        ]
    }
}