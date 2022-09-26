const Discord = require("discord.js");
const CurrencySystem = require("currency-system");
const cs = new CurrencySystem();
module.exports.run = async (client, interaction, args) => {
  if (!args[0].value) return interaction.reply("Which item to remove?");
  let amount = 1;
  if (args[1] && args[1].value) amount = args[1].value;
  let result = await cs.removeUserItem({
    user: interaction.user,
    guild: interaction.guild,
    item: parseInt(args[0].value),
    amount: amount,
  });
  if (result.error) {
    if (result.type == "Invalid-Item-Number")
      return interaction.reply(
        "There was a error, Please enter item number to remove.!"
      );
    if (result.type == "Unknown-Item")
      return interaction.reply("There was a error, The Item Does not exist!");
    if (result.type == "Invalid-Amount")
      return interaction.reply("Invalid Number of items to remove.");
    if (result.type == "Negative-Amount")
      return interaction.reply("Can't Remove Less than 1 item. Smh!");
  } else
    interaction.reply(
      `Done! Successfully sold \`${result.inventory.deleted}\` of \`${result.inventory.name}\` for free! You now have \`${result.inventory.count}\` of those items left!`
    );
};

module.exports.help = {
  name: "sell",
  data: {
    name: "sell",
    description: "A way to sell item",
    options: [
      {
        name: "item",
        type: 4,
        description: "Item Number from Inventory",
        required: true,
      },
      {
        name: "amount",
        type: 3,
        description: "Amount of Item or all",
        required: false,
      },
    ],
  },
};

module.exports.conf = {
  aliases: [],
  cooldown: 5, // This number is a seconds, not a milliseconds.
  // 1 = 1 seconds.
};
