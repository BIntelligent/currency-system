const Discord = require("discord.js");
const CurrencySystem = require("currency-system");
const cs = new CurrencySystem();
module.exports.run = async (client, message, args) => {
  if (!args[0].value) return message.reply("Which item to remove?");
  let amount = 1;
  if (args[1] && args[1].value) amount = args[1].value;
  let result = await cs.removeUserItem({
    user: message.user,
    guild: message.guild,
    item: parseInt(args[0].value),
    amount: amount,
  });
  if (result.error) {
    if (result.type == "Invalid-Item-Number")
      return message.reply(
        "There was a error, Please enter item number to remove.!"
      );
    if (result.type == "Unknown-Item")
      return message.reply("There was a error, The Item Does not exist!");
    if (result.type == "Invalid-Amount")
      return message.reply("Invalid Number of items to remove.");
    if (result.type == "Negative-Amount")
      return message.reply("Can't Remove Less than 1 item. Smh!");
  } else
    message.reply(
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
