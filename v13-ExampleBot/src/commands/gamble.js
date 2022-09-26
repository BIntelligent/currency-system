    const CurrencySystem = require("currency-system");
    const cs = new CurrencySystem;
    module.exports.run = async (client, interaction, args) => {

        let money = args[0].value
        if (isNaN(money)) return interaction.reply("Amount is not a number.");

        let result = await cs.gamble({
            user: interaction.user,
            guild: interaction.guild,
            amount: money,
            minAmount: 1,
            cooldown: 25 //25 seconds
        });
        if (result.error) {
            if (result.type == 'amount') return interaction.reply("Please insert an amount first.");
            if (result.type == 'nan') return interaction.reply("The amount was not a number.");
            if (result.type == 'low-money') return interaction.reply(`You don't have enough money. You need ${result.neededMoney}$ more to perform the action. `);
            if (result.type == 'gamble-limit') return interaction.reply(`You don't have enough money for gambling. The minimum was $${result.minAmount}.`);
            if (result.type == 'time') return interaction.reply(`Wooo that is too fast. You need to wait **${result.second}** second(s) before you can gamble again.`);
        } else {
            if (result.type == 'lost') return interaction.reply(`Ahh, no. You lose $${result.amount}. You've $${result.wallet} left. Good luck next time.`);
            if (result.type == 'won') return interaction.reply(`Woohoo! You won $${result.amount}! You've $${result.wallet}. Good luck, have fun!`);
        }
    }

    module.exports.help = {
        name: "gamble",
        data: {
            name: 'gamble',
            description: "An efficient way to double your money.",
            options: [{
                name: 'amount',
                type: 'INTEGER',
                description: 'Amount of money you want to gamble.',
                required: true,
            }]
        }
    }

    module.exports.conf = {
        aliases: ["gambling"],
        cooldown: 5
    }