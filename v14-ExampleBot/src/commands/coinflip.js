const CurrencySystem = require("currency-system");
const cs = new CurrencySystem();
module.exports.run = async (client, interaction, args) => {
  await interaction.reply("Flipping the coin...");
  let UChoice = args.get("choice");
  if (Math.floor(Math.random() * 10) > 5) {
    // 50 -50 chance
    // lets say 6-10 is heads
    if (UChoice === "heads") {
      await interaction.editReply(`Horray You Won!`);
    } else {
      await interaction.editReply(`Uh, You Lost!`);
    }
  } else {
    // lets say 1-5 is tails
    if (UChoice === "tails") {
      await interaction.editReply(`Horray You Won!`);
    } else {
      await interaction.editReply(`Uh, You Lost!`);
    }
  }
};

module.exports.help = {
  name: "coinflip",
  data: {
    name: "coinflip",
    description: "A way to earn money by betting.",
    options: [
      {
        name: "choice",
        type: 3,
        description: "With Side You Choose?",
        required: true,
        choices: [
          {
            name: "heads",
            value: "heads",
          },
          {
            name: "tails",
            value: "tails",
          },
        ],
      },
    ],
  },
};
