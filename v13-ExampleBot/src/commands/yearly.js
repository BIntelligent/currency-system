const CurrencySystem = require("currency-system");
const cs = new CurrencySystem;
module.exports.run = async (client, interaction, args) => {

    let result = await cs.yearly({
        user: interaction.user,
        guild: interaction.guild,
        amount: 27000,

    });
    if (result.error) return interaction.reply(`You have used yearly recently Try again in ${result.time}`);
    else interaction.reply(`You have earned $${result.amount}. Your streak is now ${result.rawData.streak.yearly}`);
}

module.exports.help = {
    name: "yearly",
    data: {
        name: 'yearly',
        description: "a way to earn money, yearly",
        options: []
    }
};

module.exports.conf = {
    aliases: [],
    cooldown: 5 // This number is a seconds, not a milliseconds.
    // 1 = 1 seconds.
}