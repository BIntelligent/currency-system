const Discord = require("discord.js");
const CurrencySystem = require("currency-system");
const cs = new CurrencySystem();
module.exports.run = async (client, interaction, args) => {
  let thing = args.get("item");
  if (!thing) return interaction.reply("Please provide item number");
  if (isNaN(thing))
    return interaction.reply("Please provide valid item number");
  let result = await cs.transferItem({
    user1: interaction.user.id,
    user2: args.get("user"),
    guild: interaction.guild.id,
    item: parseInt(thing),
    amount: args.get("amount") || 1,
  });
  if (result.error) {
    if (result.type === "No-Item")
      return interaction.reply("Please provide valid item number");
    if (result.type === "Invalid-Item")
      return interaction.reply("Invalid Item Number.");
    if (result.type === "Invalid-Amount")
      return interaction.reply("You can't transfer less than 1 item(s).");
    if (result.type === "In-Sufficient-Amount")
      return interaction.reply(
        "You're trying to transfer more items than you have."
      );
  } else
    return interaction.reply(
      `Successfully transfered \`${result.transfered}\` \`${
        result.itemName
      }\`'s to \`${
        client.users.cache.get(args.get("user")).tag
      }\`. Now You have \`${
        result.itemsLeft === 0 ? "no" : result.itemsLeft
      }\` items remianing.`
    );
};

module.exports.help = {
  name: "transferitem",
  data: {
    name: "transferitem",
    description: "Share Item's with your friends.",
    options: [
      {
        name: "user",
        type: 6,
        description: "User to whom you'll send items to.",
        required: true,
      },
      {
        name: "item",
        type: 4,
        description: "Item Number from the shop.",
        required: true,
      },
      {
        name: "amount",
        type: 3,
        description: "Amount of Items to transfer!",
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
