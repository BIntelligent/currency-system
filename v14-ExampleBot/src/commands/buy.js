const Discord = require("discord.js");
const CurrencySystem = require("currency-system");
const cs = new CurrencySystem();
module.exports.run = async (client, interaction, args) => {
  let thing = args[0].value;
  if (!thing) return interaction.reply("Please provide item number");
  if (isNaN(thing)) return interaction.reply("Please provide valid item number");
  let result = await cs.buy({
    user: interaction.user,
    guild: interaction.guild,
    item: parseInt(args[0].value),
    amount: args[1]?.value || 1,
  });
  if (result.error) {
    if (result.type === "No-Item")
      return interaction.reply("Please provide valid item number");
    if (result.type === "Invalid-Item")
      return interaction.reply("item does not exists");
    if (result.type === "low-money")
      return interaction.reply(
        `**You don't have enough balance to buy this item!**`
      );
    if (result.type === "Invalid-Amount")
      return interaction.channel.send("Can't add less than 1 item.");
  } else
    return interaction.reply(
      `**Successfully bought ${args[1]?.value || 1} of \`${
        result.inventory.name
      }\` for $${result.price}**`
    );
};

module.exports.help = {
  name: "buy",
  data: {
    name: "buy",
    description: "A way to Buy stuff from shop!",
    options: [
      {
        name: "item",
        type: 4,
        description: "Item Number from the shop.",
        required: true,
      },
      {
        name: "amount",
        type: 3,
        description: "Amount of Items to buy!",
        required: false,
      },
    ],
  },
};

module.exports.conf = {
  aliases: ["b"],
  cooldown: 5, // This number is a seconds, not a milliseconds.
  // 1 = 1 seconds.
};
