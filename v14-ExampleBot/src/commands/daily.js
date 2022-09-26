const CurrencySystem = require("currency-system");
const cs = new CurrencySystem();
module.exports.run = async (client, interaction, args) => {
  let result = await cs.daily({
    user: interaction.user,
    guild: interaction.guild,
    amount: 100,
  });
  if (result.error)
    return interaction.reply(
      `You have used daily recently Try again in ${result.time}`
    );
  else
    interaction.reply(
      `You have earned $${result.amount}. Your streak is now ${result.rawData.streak.daily}`
    );
};

module.exports.help = {
  name: "daily",
  data: {
    name: "daily",
    description: "A way to Earn Money!",
    options: [],
  },
};

module.exports.conf = {
  aliases: [],
  cooldown: 5, // This number is a seconds, not a milliseconds.
  // 1 = 1 seconds.
};
