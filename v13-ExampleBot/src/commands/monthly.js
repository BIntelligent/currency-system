const CurrencySystem = require("currency-system");
const cs = new CurrencySystem;
module.exports.run = async (client, interaction, args) => {

    let result = await cs.monthly({
        user: interaction.user,
        guild: interaction.guild,
        amount: 6000,

    });
    if (result.error) return interaction.reply(`You have used monthly recently Try again in ${result.time}`);
    else interaction.reply(`You have earned $${result.amount}. Your streak is now ${result.rawData.streak.monthly}`);
}

module.exports.help = {
    name: "monthly",
    data: {
        name: 'monthly',
    description: "a way to earn money, monthly",
    options: []
    }
};

module.exports.conf = {
    aliases: [],
    cooldown: 5 // This number is a seconds, not a milliseconds.
    // 1 = 1 seconds.
}