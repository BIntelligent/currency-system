const CurrencySystem = require("currency-system");
const Discord = require("discord.js");
const cs = new CurrencySystem();

module.exports.run = async (client, interaction, args) => {
  let data = await cs.leaderboard(interaction.guild.id);
  if (data.length < 1) return interaction.reply("Nobody's in leaderboard yet.");
  const msg = new Discord.EmbedBuilder();
  let pos = 0;
  // This is to get First 10 Users )
  let arr = [];
  data.slice(0, 10).map((e) => {
    if (!client.users.cache.get(e.userID)) return;
    pos++;
    arr.push({
      name: `${pos} - **${client.users.cache.get(e.userID).username}**`,
      value: `Wallet: **${e.wallet}** - Bank: **${e.bank}**`,
      inline: true,
    });
  });
  msg.addFields(arr);
  interaction
    .reply({
      embeds: [msg],
    })
    .catch();
};

module.exports.help = {
  name: "leaderboard",
  data: {
    name: "leaderboard",
    description: "show's guild leaderboard.",
    options: [],
  },
};

module.exports.conf = {
  aliases: ["lb"],
  cooldown: 5,
};
