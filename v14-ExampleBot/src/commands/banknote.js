const CurrencySystem = require("currency-system");
const cs = new CurrencySystem();
module.exports.run = async (client, message) => {
  const arr = await cs.getUserItems({
    user: message.user,
    guild: message.guild.id,
  });
  if (!arr.inventory.length)
    return message.reply("You don't have any banknotes!");
  for (i in arr.inventory) {
    if (arr.inventory[i].name.toLowerCase().includes("banknote")) {
      i++;
      const removeItem = await cs.removeUserItem({
        user: message.user,
        item: i,
        guild: message.guild.id,
        amount: 1,
      });
      if (removeItem.error) {
        console.log("Bot tried to remove item number " + i);
        return message.reply("Unknown error occured see console.");
      }
      const ToincreasedAmount = 5000 + removeItem.rawData.bankSpace;
      const result = await cs.setBankSpace(
        message.user.id,
        message.guild.id,
        ToincreasedAmount
      );
      if (!result.error)
        return message.reply(`Successfully set Bank Limit to ${result.amount}`);
      else return message.reply(`Error: occured: ${result.error}`);
    } else return message.reply("Please buy the item first!");
  }
};

module.exports.help = {
  name: "banknote",
  data: {
    name: "banknote",
    description: "A way to increase bank money limit!",
    options: [],
  },
};

module.exports.conf = {
  aliases: [],
  cooldown: 5, // This number is a seconds, not a milliseconds.
  // 1 = 1 seconds.
};
