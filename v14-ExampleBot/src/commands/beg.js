const CurrencySystem = require("currency-system");
const cs = new CurrencySystem;
module.exports.run = async (client, interaction, args) => {

    let result = await cs.beg({
        user: interaction.user,
        guild: interaction.guild,
        minAmount: 100,
        maxAmount: 400,
        cooldown: 10 // 60 seconds

    });
    if (result.error) return interaction.reply(`You have begged recently Try again in ${result.time}`);
    else interaction.reply(`You have earned $${result.amount}.`)
}

module.exports.help = {
    name: "beg",
    data: {
        name: "beg",
        description: "a way to earn money, beg",
        options: []
    }
};

module.exports.conf = {
    aliases: [],
    cooldown: 5 // This number is a seconds, not a milliseconds.
    // 1 = 1 seconds.
}