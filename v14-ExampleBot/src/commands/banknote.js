const CurrencySystem = require("currency-system");
const cs = new CurrencySystem();
module.exports.run = async (client, interaction) => {
  const arr = await cs.getUserItems({
    user: interaction.user,
    guild: interaction.guild.id,
  });
  if (!arr.inventory.length)
    return interaction.reply("You don't have any banknotes!");
  for (i in arr.inventory) {
    if (arr.inventory[i].name.toLowerCase().includes("banknote")) {
      i++;
      const removeItem = await cs.removeUserItem({
        user: interaction.user,
        item: i,
        guild: interaction.guild.id,
        amount: 1,
      });
      if (removeItem.error) {
        console.log("Bot tried to remove item number " + i);
        return interaction.reply("Unknown error occured see console.");
      }
      const ToincreasedAmount = 5000 + removeItem.rawData.bankSpace;
      const result = await cs.setBankSpace(
        interaction.user.id,
        interaction.guild.id,
        ToincreasedAmount
      );
      if (!result.error)
        return interaction.reply(`Successfully set Bank Limit to ${result.amount}`);
      else return interaction.reply(`Error: occured: ${result.error}`);
    } else return interaction.reply("Please buy the item first!");
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
