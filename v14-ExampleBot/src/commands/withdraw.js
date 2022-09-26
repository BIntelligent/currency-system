const CurrencySystem = require("currency-system");
const cs = new CurrencySystem();
module.exports.run = async (client, interaction, args) => {
  let money = args[0].value;
  if (!money) return interaction.reply("Enter the amount you want to withdraw.");

  let result = await cs.withdraw({
    user: interaction.user,
    guild: interaction.guild,
    amount: money,
  });
  if (result.error) {
    if (result.type === "money")
      return interaction.reply("Specify an amount to withdraw");
    if (result.type === "negative-money")
      return interaction.reply(
        "You can't withdraw negative money, please use deposit command"
      );
    if (result.type === "low-money")
      return interaction.reply("You don't have that much money in bank.");
    if (result.type === "no-money")
      return interaction.reply("You don't have any money to withdraw");
  } else {
    if (result.type === "all-success")
      return interaction.reply(
        "You have withdraw'd all your money from your bank" +
          `\nNow you've $${result.rawData.wallet} In your wallet and $${result.rawData.bank} in your bank.`
      );
    if (result.type === "success")
      return interaction.reply(
        `You have withdraw $${result.amount} money from your bank.\nNow you've $${result.rawData.wallet} In your wallet and $${result.rawData.bank} in your bank.`
      );
  }
};

module.exports.help = {
  name: "withdraw",
  data: {
    name: "withdraw",
    description: "A way to get money out of the bank.",
    options: [
      {
        name: "amount",
        type: require("discord.js").ApplicationCommandOptionType.String,
        description: "Amount of money to withdraw.",
        required: true,
      },
    ],
  },
};

module.exports.conf = {
  aliases: ["wd"],
  cooldown: 5,
};
