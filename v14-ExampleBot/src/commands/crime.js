const CurrencySystem = require("currency-system");
const cs = new CurrencySystem();
const Discord = require("discord.js");
let collection = new Discord.Collection();
module.exports.run = async (client, interaction, args) => {
  if (collection.has(interaction.user.id))
    return interaction.reply(
      `You Recently tried this command. please try again in ${cs.parseSeconds(
        Math.floor(
          60 - (Date.now() - collection.get(interaction.user.id)) / 1000
        )
      )}`
    );
  await interaction.reply("Robbing the bank...");
  let chance = Math.random() * 100 < 10; /* percentage */
  collection.set(interaction.user.id, Date.now());
  // User can re run after 1 minute.
  setTimeout(() => collection.delete(interaction.user.id), 60000);
  let data = await cs.balance({
    user: interaction.user.id,
    guild: interaction.guild.id,
  });
  let amount = Math.floor(Math.random() * 10000); // Random Number under 10k
  if (data.wallet < amount) amount = data.wallet;
  if (amount < 1)
    return interaction.editReply("You need some money to try crime.");
  if (chance) {
    // lived.
    interaction.editReply({
      content: `Successfully robbed the bank and got away with \`$${amount}\``,
    });
    await cs.addMoney({
      user: interaction.user.id,
      guild: interaction.guild.id,
      amount: amount,
      wheretoPutMoney: "wallet",
    });
  } else {
    // was caught
    interaction.editReply({
      content: `Fudge, You robbed the bank and Police arrived in time. They Took \`$${amount}\` in compensation.`,
    });
    await cs.removeMoney({
      user: interaction.user.id,
      guild: interaction.guild.id,
      amount: amount,
      wheretoPutMoney: "wallet",
    });
  }
};

module.exports.help = {
  name: "crime",
  data: {
    name: "crime",
    description: "Earn Money By Crime",
    options: [],
  },
};

module.exports.conf = {
  aliases: [],
  cooldown: 5, // This number is a seconds, not a milliseconds.
  // 1 = 1 seconds.
};
