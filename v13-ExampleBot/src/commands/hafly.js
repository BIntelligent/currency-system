const CurrencySystem = require("currency-system");
const cs = new CurrencySystem;
module.exports.run = async (client, interaction, args) => {

    let result = await cs.hafly({
        user: interaction.user,
        guild: interaction.guild,
        amount: 100,

    });
    if (result.error) return interaction.reply(`You have used hafly recently Try again in ${result.time}`);
    else return interaction.reply(`You have earned $${result.amount}. Your streak is now ${result.rawData.streak.hafly}`);
}

module.exports.help = {
    name: "hafly",
    data: {
        name: 'hafly',
        description: "a way to earn money, hafly",
        options: []
    }
};

module.exports.conf = {
    aliases: [],
    cooldown: 5 // This number is a seconds, not a milliseconds.
    // 1 = 1 seconds.
}