const CurrencySystem = require("currency-system");
const cs = new CurrencySystem();
module.exports.run = async (client, interaction, args) => {
  let money = args[0].value;
  if (!money) return interaction.reply("Enter the amount you want to deposite.");

  let result = await cs.deposite({
    user: interaction.user,
    guild: interaction.guild,
    amount: money,
  });
  if (result.error) {
    if (result.type === "money")
      return interaction.reply("Specify an amount to deposite");
    if (result.type === "negative-money")
      return interaction.reply("You can't deposite negative money");
    if (result.type === "low-money")
      return interaction.reply("You don't have that much money in wallet.");
    if (result.type === "no-money")
      return interaction.reply("You don't have any money to deposite");
    if (result.type === "bank-full")
      return interaction.reply("Your bank is full. It has reached it's limit.");
  } else {
    if (result.type === "all-success")
      return interaction.reply(
        "You have deposited all your money to your bank" +
          `\nNow you've $${result.rawData.wallet} In your wallet and $${result.rawData.bank} in your bank.`
      );
    if (result.type === "success")
      return interaction.reply(
        `You have deposited $${result.amount} money to your bank.\nNow you've $${result.rawData.wallet} In your wallet and $${result.rawData.bank} in your bank.`
      );
  }
};

module.exports.help = {
  name: "deposite",
  data: {
    name: "deposite",
    description: "A way to get money in of the bank.",
    options: [
      {
        name: "amount",
        type: require("discord.js").ApplicationCommandOptionType.String,
        description: "Amount of money you want to deposite.",
        required: true,
      },
    ],
  },
};

module.exports.conf = {
  aliases: ["dep"],
  cooldown: 5,
};
