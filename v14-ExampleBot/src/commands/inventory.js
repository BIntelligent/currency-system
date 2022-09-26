const Discord = require("discord.js");
const CurrencySystem = require("currency-system");
const cs = new CurrencySystem();
module.exports.run = async (client, interaction, args) => {
  const user = interaction.options.getUser("user") || interaction.user;
  let result = await cs.getUserItems({
    user: user,
    guild: interaction.guild,
  });
  let inv = result.inventory.slice(0, 10);
  const embed = new Discord.EmbedBuilder().setDescription(
    "Your Inventory in Empty!"
  );
  let arr = [];
  for (key of inv) {
    arr.push({ name: `**${key.name}:**`, value: `Amount: ${key.amount}` });
    embed.setDescription("Your Inventory!");
  }
  embed.addFields(arr);
  return interaction.reply({
    embeds: [embed],
  });
};

module.exports.help = {
  name: "inventory",
  data: {
    name: "inventory",
    description: "A way to see inventory",
    options: [
      {
        name: "user",
        type: 6,
        description: "The user you want to check inventory of..",
        required: false,
      },
    ],
  },
};

module.exports.conf = {
  aliases: ["inv"],
  cooldown: 5, // This number is a seconds, not a milliseconds.
  // 1 = 1 seconds.
};
