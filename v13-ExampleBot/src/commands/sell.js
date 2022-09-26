const Discord = require("discord.js");
const CurrencySystem = require("currency-system");
const cs = new CurrencySystem();
module.exports.run = async (client, interaction, args) => {
  if (!args[0].value) return interaction.reply("Which item to remove?");
  let result = await cs.removeUserItem({
    user: interaction.user,
    guild: interaction.guild,
    item: parseInt(args[0].value),
    amount: 1,
  });
  if (result.error) {
    if (result.type == "Invalid-Item-Number")
      return interaction.reply(
        "There was a error, Please enter item number to remove.!"
      );
    if (result.type == "Unknown-Item")
      return interaction.reply("There was a error, The Item Does not exist!");
  } else
    interaction.reply(
      "Done! Successfully sold the `" +
        result.inventory.name +
        "` for free! You now have " +
        result.inventory.amount +
        " of those items left!"
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
        type: "INTEGER",
        description: "Item Number from Inventory",
        required: true,
      },
    ],
  },
};

module.exports.conf = {
  aliases: [],
  cooldown: 5, // This number is a seconds, not a milliseconds.
  // 1 = 1 seconds.
};
